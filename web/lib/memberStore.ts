import { mkdir, readFile, rename, writeFile } from "fs/promises";
import path from "path";
import { getAddress, isAddress, recoverMessageAddress, type Address, type Hex } from "viem";
import {
  freshStamp,
  readCardMessage,
  readLinkMessage,
  same,
  type MemberCard,
} from "./members";

const MAX_MEMBERS = 400;
const MAX_LINKS = 40;

type Book = Record<string, MemberCard>;

let queue: Promise<unknown> = Promise.resolve();
let held: Book | null = null;

function bookPath(): string {
  return process.env.MEMBERS_PATH || path.join(process.cwd(), ".data", "members.json");
}

function withBook<T>(fn: (book: Book) => Promise<T>): Promise<T> {
  const run = queue.then(async () => fn(await load()));
  queue = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

async function load(): Promise<Book> {
  if (held) return held;
  try {
    const raw = await readFile(bookPath(), "utf8");
    held = parseBook(raw);
  } catch (err) {
    const code = (err as NodeJS.ErrnoException).code;
    if (code === "ENOENT") held = {};
    else throw err;
  }
  return held ?? {};
}

function parseBook(raw: string): Book {
  const parsed = JSON.parse(raw) as unknown;
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("book");
  const book: Book = {};
  for (const [key, value] of Object.entries(parsed)) {
    const card = asCard(value);
    if (!card || !same(key, card.address)) continue;
    book[card.address.toLowerCase()] = card;
  }
  return book;
}

function asCard(value: unknown): MemberCard | null {
  if (!value || typeof value !== "object") return null;
  const card = value as MemberCard;
  if (!isAddress(card.address) || typeof card.name !== "string" || typeof card.line !== "string") return null;
  if (!card.socials || !Array.isArray(card.links) || typeof card.at !== "string") return null;
  return {
    address: getAddress(card.address),
    name: card.name,
    line: card.line,
    socials: {
      x: card.socials.x ?? "",
      farcaster: card.socials.farcaster ?? "",
      telegram: card.socials.telegram ?? "",
      site: card.socials.site ?? "",
    },
    links: card.links.filter((item) => isAddress(item)).map((item) => getAddress(item)),
    at: card.at,
  };
}

async function save(book: Book): Promise<void> {
  const file = bookPath();
  await mkdir(path.dirname(file), { recursive: true });
  const next = `${file}.next`;
  await writeFile(next, JSON.stringify(book), { mode: 0o600 });
  await rename(next, file);
  held = book;
}

export async function listMembers(): Promise<MemberCard[]> {
  const book = await withBook(async (current) => current);
  return Object.values(book).sort((left, right) => (left.at < right.at ? 1 : -1));
}

export async function saveCard(message: string, signature: Hex): Promise<MemberCard> {
  const card = readCardMessage(message);
  if (!card) throw new Error("That card could not be read. Check the name and the socials.");
  if (!freshStamp(card.at)) throw new Error("That card is not signed for now. Sign it again.");
  const signer = await recover(message, signature);
  if (!same(signer, card.address)) throw new Error("The wallet did not sign that card.");
  return withBook(async (book) => {
    const key = card.address.toLowerCase();
    const previous = book[key];
    if (!previous && Object.keys(book).length >= MAX_MEMBERS) throw new Error("The street is full for tonight.");
    const next: MemberCard = {
      address: card.address,
      name: card.name,
      line: card.line,
      socials: card.socials,
      links: previous?.links ?? [],
      at: new Date(card.at * 1000).toISOString(),
    };
    book[key] = next;
    await save(book);
    return next;
  });
}

export async function saveLink(message: string, signature: Hex): Promise<MemberCard> {
  const link = readLinkMessage(message);
  if (!link) throw new Error("That link could not be read.");
  if (!freshStamp(link.at)) throw new Error("That link is not signed for now. Sign it again.");
  const signer = await recover(message, signature);
  if (!same(signer, link.address)) throw new Error("The wallet did not sign that link.");
  return withBook(async (book) => {
    const mine = book[link.address.toLowerCase()];
    if (!mine) throw new Error("Sign your card before you link anyone.");
    const other = book[link.other.toLowerCase()];
    if (!other) throw new Error("That wallet has no card yet.");
    const links = mine.links.filter((item) => !same(item, link.other));
    if (link.on) {
      if (links.length >= MAX_LINKS) throw new Error("That card is linked to as many members as it can hold.");
      links.push(link.other);
    }
    const next: MemberCard = { ...mine, links, at: new Date(link.at * 1000).toISOString() };
    book[mine.address.toLowerCase()] = next;
    await save(book);
    return next;
  });
}

async function recover(message: string, signature: Hex): Promise<Address> {
  try {
    return await recoverMessageAddress({ message, signature });
  } catch {
    throw new Error("The wallet did not sign that card.");
  }
}
