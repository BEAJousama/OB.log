import type { MetadataRoute } from "next"
import { getAllPostSlugs } from "@/lib/blog/api"

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://blog.obeaj.com"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getAllPostSlugs()
  const posts: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url: `${baseUrl}/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }))
  return [{ url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 }, ...posts]
}
