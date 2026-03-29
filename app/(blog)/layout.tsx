import type { ReactNode } from "react"
import BlogShell from "@/components/blog/blog-shell"

/**
 * Single shell for all blog routes so IntroProvider (and intro state) survives
 * client-side navigations but resets on full page load / refresh.
 */
export default function BlogLayout({ children }: { children: ReactNode }) {
  return <BlogShell>{children}</BlogShell>
}
