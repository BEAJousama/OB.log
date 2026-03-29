import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import type { BlogPost } from "@/lib/blog/types"
import { estimateReadingTimeMinutes, formatPostDate } from "@/lib/blog/format"
import { cn } from "@/lib/utils"

type PostCardProps = {
  post: BlogPost
}

export default function PostCard({ post }: PostCardProps) {
  const readingTime = estimateReadingTimeMinutes(post.excerpt, post.body)

  return (
    <article className="glass-panel p-5 transition-[box-shadow,border-color] hover:border-accent/25 md:p-6">
      <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <span>{formatPostDate(post.publishedAt)}</span>
        <span>•</span>
        <span>{readingTime} min read</span>
        {post.author && (
          <>
            <span>•</span>
            <span className="pixel-text">{post.author.name}</span>
          </>
        )}
        {post.categories?.map((cat) => (
          <span key={cat._id}>
            <span className="mr-1 opacity-40">•</span>
            <span
              className="pixel-text uppercase tracking-widest"
              style={{ color: cat.color ?? "var(--accent)" }}
            >
              {cat.title}
            </span>
          </span>
        ))}
      </div>

      <h2 className="section-title mb-3 text-lg md:text-xl">
        <Link href={`/${post.slug}`} className="transition-colors hover:text-accent">
          {post.title}
        </Link>
      </h2>

      <p className="body-copy mb-4">{post.excerpt}</p>

      {post.tags.length > 0 && (
        <div className="mb-5 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className={cn(
                "glass-chip border-0 px-2.5 py-0.5 text-[0.65rem] uppercase tracking-wide",
                "text-muted-foreground",
              )}
            >
              {tag}
            </Badge>
          ))}
        </div>
      )}

      <Link href={`/${post.slug}`} className="retro-button inline-flex items-center text-xs font-semibold md:text-sm">
        [ Read Article ]
      </Link>
    </article>
  )
}
