import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ShareBar } from "@/components/ShareBar";
import { night } from "@/lib/art";
import { findPost, posts, type BlogBlock } from "@/lib/blog";
import { origin } from "@/lib/share";

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = findPost(slug);
  if (!post) return {};
  const url = `${origin}/blog/${post.slug}`;
  const title = `${post.title} · The Floor`;
  return {
    title: post.title,
    description: post.lede,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: post.lede,
      url,
      images: [{ url: `${origin}/og.png`, width: 1200, height: 630, alt: title, type: "image/png" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: post.lede,
      images: [`${origin}/og.png`],
    },
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = findPost(slug);
  if (!post) notFound();
  const others = posts.filter((item) => item.slug !== post.slug).slice(0, 3);

  return (
    <article>
      <Link href="/blog" className="label">
        The blog
      </Link>
      <p className="label mt-6">
        {post.kicker} · {post.date}
      </p>
      <h1 className="mt-3 max-w-3xl font-serif text-5xl tracking-tight sm:text-6xl">{post.title}</h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink/80">{post.lede}</p>
      <p className="mt-3 text-sm text-ink/55">
        Source{" "}
        <a className="text-brass" href={post.href} target="_blank" rel="noreferrer">
          {post.source}
        </a>
        {post.notes?.map((note) => (
          <span key={note.href}>
            {" · "}
            <a className="text-brass" href={note.href} target="_blank" rel="noreferrer">
              {note.source}
            </a>
          </span>
        ))}
      </p>
      <ShareBar id="blog" path={`/blog/${post.slug}`} title={post.title} text={post.lede} />
      <img
        src={night(post.image)}
        alt=""
        width={800}
        height={450}
        className="panel mt-8 h-64 w-full object-cover sm:h-80"
      />
      <div className="mt-8 max-w-2xl space-y-5">
        {post.blocks.map((block, index) => (
          <Block key={`${block.type}-${index}`} block={block} />
        ))}
      </div>
      <div className="mt-14">
        <p className="label">Also in the paper</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {others.map((item) => (
            <Link key={item.slug} href={`/blog/${item.slug}`} className="panel p-5">
              <p className="text-[11px] tracking-[0.14em] text-ink/45">
                {item.kicker} · {item.date}
              </p>
              <h2 className="mt-2 font-serif text-xl tracking-tight">{item.title}</h2>
            </Link>
          ))}
        </div>
      </div>
    </article>
  );
}

function Block({ block }: { block: BlogBlock }) {
  switch (block.type) {
    case "p":
      return <p className="text-lg leading-relaxed text-ink/85">{block.text}</p>;
    case "h":
      return <h2 className="pt-4 font-serif text-3xl tracking-tight">{block.text}</h2>;
    case "quote":
      return <blockquote className="border-l-2 border-brass pl-5 font-serif text-2xl leading-snug text-brass">{block.text}</blockquote>;
    default: {
      const neverBlock: never = block;
      return neverBlock;
    }
  }
}
