import Link from "next/link";
import { ShareBar } from "@/components/ShareBar";
import { night } from "@/lib/art";
import { posts } from "@/lib/blog";
import { pageMeta } from "@/lib/share";

export const metadata = pageMeta("blog");

export default function BlogPage() {
  const [lead, ...rest] = posts;

  return (
    <article>
      <p className="label">Night Paper</p>
      <h1 className="mt-2 font-serif text-5xl tracking-tight sm:text-6xl">The blog</h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink/80">
        Robinhood, the pixel, and what the rails can hold. Each note has a date and a source. Nothing here is a tip.
      </p>
      <ShareBar id="blog" />
      {lead ? (
        <Link href={`/blog/${lead.slug}`} className="panel mt-10 block overflow-hidden">
          <div className="relative">
            <img
              src={night(lead.image)}
              alt=""
              width={800}
              height={450}
              className="h-64 w-full object-cover sm:h-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/25 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
              <p className="label">
                {lead.kicker} · {lead.date}
              </p>
              <h2 className="mt-2 max-w-3xl font-serif text-4xl tracking-tight sm:text-5xl">{lead.title}</h2>
            </div>
          </div>
          <p className="max-w-3xl p-6 text-lg leading-relaxed text-ink/80 sm:p-8">{lead.lede}</p>
        </Link>
      ) : null}
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {rest.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="panel flex flex-col overflow-hidden">
            <img src={night(post.image)} alt="" width={800} height={450} loading="lazy" decoding="async" className="h-36 w-full object-cover" />
            <div className="flex flex-1 flex-col p-5">
              <p className="label">
                {post.kicker} · {post.date}
              </p>
              <h2 className="mt-2 font-serif text-2xl tracking-tight">{post.title}</h2>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-ink/75">{post.lede}</p>
            </div>
          </Link>
        ))}
      </div>
    </article>
  );
}
