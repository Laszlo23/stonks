import { isHex, type Hex } from "viem";
import { listMembers, saveCard, saveLink } from "@/lib/memberStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const members = await listMembers();
    return Response.json({ members });
  } catch {
    return Response.json({ error: "The member book could not be read." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  let body: { kind?: unknown; message?: unknown; signature?: unknown };
  try {
    body = (await request.json()) as { kind?: unknown; message?: unknown; signature?: unknown };
  } catch {
    return Response.json({ error: "That card could not be read." }, { status: 400 });
  }
  if (typeof body.message !== "string" || typeof body.signature !== "string" || !isHex(body.signature)) {
    return Response.json({ error: "Sign the card in your wallet." }, { status: 400 });
  }
  const signature = body.signature as Hex;
  try {
    const member =
      body.kind === "link"
        ? await saveLink(body.message, signature)
        : body.kind === "card"
          ? await saveCard(body.message, signature)
          : null;
    if (!member) return Response.json({ error: "That card could not be read." }, { status: 400 });
    return Response.json({ member });
  } catch (err) {
    return Response.json({ error: publicError(err) }, { status: 400 });
  }
}

function publicError(err: unknown): string {
  const message = err instanceof Error ? err.message : "";
  if (message.startsWith("That ") || message.startsWith("The ") || message.startsWith("Sign ")) return message;
  return "The card did not save.";
}
