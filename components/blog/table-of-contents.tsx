"use client"

import { useState, useEffect, useRef, useCallback, useLayoutEffect } from "react"
import { Linkedin, Link2, Check } from "lucide-react"
import { FaXTwitter } from "react-icons/fa6"
import type { TocHeading } from "@/lib/blog/toc"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/contexts/LanguageContext"

type Props = {
  headings: TocHeading[]
}

function Toast({ show, message }: { show: boolean; message: string }) {
  if (!show) return null
  return (
    <div
      className="glass-panel fixed z-[10050] flex items-center gap-2 px-4 py-2"
      style={{
        top: "calc(var(--site-header-offset) + 0.5rem)",
        left: "50%",
        transform: "translateX(-50%)",
        animation: "toastFadeIn 0.3s ease-out forwards",
      }}
    >
      <Check size={16} className="text-green-500" />
      <span className="pixel-text text-xs">{message}</span>
      <style jsx>{`
        @keyframes toastFadeIn {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
      `}</style>
    </div>
  )
}

function NavList({
  headings,
  activeId,
  onPick,
  density,
}: {
  headings: TocHeading[]
  activeId: string
  onPick: (id: string) => void
  density: "desktop" | "mobile"
}) {
  const isDesktop = density === "desktop"
  const textLg = isDesktop ? "text-sm" : "text-[0.9375rem]"
  const textSm = isDesktop ? "text-xs" : "text-sm"
  const pad = isDesktop ? 16 : 14

  return (
    <ol className="space-y-0.5">
      {headings.map(({ id, text, level }) => {
        const isActive = id === activeId
        const isH2 = level === 2
        return (
          <li key={id} style={{ paddingLeft: `${(level - 2) * pad}px` }}>
            <button
              type="button"
              onClick={() => onPick(id)}
              className={cn(
                "pixel-text group flex w-full items-start gap-2.5 border-l-2 py-2 pl-3 text-left transition-all duration-150",
                isH2 ? textLg : textSm,
                isActive
                  ? "border-accent text-accent"
                  : "border-transparent text-muted-foreground hover:border-border hover:text-foreground",
              )}
            >
              <span
                className={cn(
                  "mt-1 inline-block shrink-0 transition-all duration-150",
                  isH2 ? "h-2 w-2" : "h-1.5 w-1.5",
                  isActive ? "bg-accent" : "border border-current opacity-40 group-hover:opacity-70",
                )}
              />
              <span className="line-clamp-3 leading-snug">{text}</span>
            </button>
          </li>
        )
      })}
    </ol>
  )
}

export default function TableOfContents({ headings }: Props) {
  const { t } = useLanguage()
  const [activeId, setActiveId] = useState(headings[0]?.id ?? "")
  const [mobileOpen, setMobileOpen] = useState(false)
  const [shareUrl, setShareUrl] = useState("")
  const [toastVisible, setToastVisible] = useState(false)
  const [mobilePanelTop, setMobilePanelTop] = useState(120)

  const mobileStickyRef = useRef<HTMLDivElement>(null)
  const desktopProgressRef = useRef<HTMLDivElement>(null)
  const mobileProgressRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number>(0)

  const updateMobilePanelAnchor = useCallback(() => {
    const el = mobileStickyRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    setMobilePanelTop(r.bottom + 8)
  }, [])

  useLayoutEffect(() => {
    updateMobilePanelAnchor()
  }, [updateMobilePanelAnchor, mobileOpen])

  useEffect(() => {
    const onWin = () => updateMobilePanelAnchor()
    window.addEventListener("scroll", onWin, { passive: true })
    window.addEventListener("resize", onWin)
    return () => {
      window.removeEventListener("scroll", onWin)
      window.removeEventListener("resize", onWin)
    }
  }, [updateMobilePanelAnchor])

  useEffect(() => {
    if (!headings.length) return
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible.length > 0) setActiveId(visible[0].target.id)
      },
      { rootMargin: "-92px 0% -60% 0%", threshold: 0 },
    )
    headings.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [headings])

  useEffect(() => {
    if (typeof window === "undefined") return
    const href = window.location.href
    const clean = href.split("#")[0]
    setShareUrl(clean)
  }, [])

  const handleShare = useCallback(
    (platform: "x" | "linkedin") => {
      if (typeof window === "undefined") return
      const url = encodeURIComponent(shareUrl || window.location.href)
      const text = encodeURIComponent(document.title || t.blogTitle)

      let shareLink = ""
      if (platform === "x") {
        shareLink = `https://x.com/intent/tweet?url=${url}&text=${text}`
      } else {
        shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`
      }

      window.open(shareLink, "_blank", "noopener,noreferrer")
    },
    [shareUrl, t.blogTitle],
  )

  const handleCopyLink = useCallback(() => {
    if (typeof window === "undefined") return
    const url = shareUrl || window.location.href
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(url).then(
        () => {
          setToastVisible(true)
          setTimeout(() => setToastVisible(false), 2000)
        },
        () => {
          setToastVisible(true)
          setTimeout(() => setToastVisible(false), 2000)
        },
      )
    } else {
      const textarea = document.createElement("textarea")
      textarea.value = url
      textarea.style.position = "fixed"
      textarea.style.opacity = "0"
      document.body.appendChild(textarea)
      textarea.focus()
      textarea.select()
      try {
        document.execCommand("copy")
      } catch {
        // ignore
      }
      document.body.removeChild(textarea)
      setToastVisible(true)
      setTimeout(() => setToastVisible(false), 2000)
    }
  }, [shareUrl])

  useEffect(() => {
    const onScroll = () => {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(() => {
        const sy = window.scrollY
        const h = document.documentElement.scrollHeight - window.innerHeight
        const pct = h > 0 ? Math.min((sy / h) * 100, 100) : 0
        const pctStr = `${pct}%`

        if (desktopProgressRef.current) desktopProgressRef.current.style.width = pctStr
        if (mobileProgressRef.current) mobileProgressRef.current.style.width = pctStr
      })
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener("scroll", onScroll)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  useEffect(() => {
    if (!mobileOpen) return
    const close = () => setMobileOpen(false)
    const timer = setTimeout(() => {
      window.addEventListener("scroll", close, { passive: true, once: true })
    }, 150)
    return () => {
      clearTimeout(timer)
      window.removeEventListener("scroll", close)
    }
  }, [mobileOpen])

  useEffect(() => {
    if (!mobileOpen) {
      document.body.style.overflow = ""
      return
    }
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prev
    }
  }, [mobileOpen])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })
    setMobileOpen(false)
  }

  const activeHeading = headings.find((h) => h.id === activeId)

  const shareBtnClassDesktop =
    "glass-chip flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-muted-foreground ring-1 ring-border/35 transition-colors hover:text-accent"

  return (
    <>
      <Toast show={toastVisible} message={t.blogCopied} />

      <div
        className="fixed z-30 hidden min-[1440px]:block"
        style={{
          top: "calc(var(--site-header-offset) + 0.5rem)",
          right: "calc(50vw + 512px + 20px)",
          width: "210px",
        }}
      >
        <div className="glass-panel p-4">
          <div className="mb-4 flex items-center gap-2">
            <span className="section-title text-xs tracking-widest text-accent">[ {t.blogIndexTitle} ]</span>
            <span className="h-px flex-1 bg-border/70" />
          </div>

          <div className="glass-chip mb-4 h-1.5 w-full overflow-hidden rounded-full">
            <div ref={desktopProgressRef} className="h-full rounded-full bg-accent" style={{ width: "0%" }} />
          </div>

          <nav aria-label={t.blogArticleSections}>
            <NavList headings={headings} activeId={activeId} onPick={scrollTo} density="desktop" />
          </nav>

          <p className="pixel-text mt-4 border-t border-border/60 pt-3 text-xs text-muted-foreground">
            {headings.filter((h) => h.level === 2).length}&nbsp;{t.blogSectionsCount}
          </p>
        </div>

        <div className="glass-panel mt-3 p-3">
          <p className="pixel-text mb-3 text-xs text-muted-foreground">{t.blogShare}</p>
          <div className="flex flex-wrap justify-center gap-2">
            <button type="button" onClick={() => handleShare("x")} aria-label={t.blogShareOnX} className={shareBtnClassDesktop}>
              <FaXTwitter size={16} />
            </button>
            <button
              type="button"
              onClick={() => handleShare("linkedin")}
              aria-label={t.blogShareOnLinkedIn}
              className={shareBtnClassDesktop}
            >
              <Linkedin size={16} />
            </button>
            <button type="button" onClick={handleCopyLink} aria-label={t.blogCopyLink} className={shareBtnClassDesktop}>
              <Link2 size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile: sticky strip only (progress + toggle) — layout height unchanged when menu opens */}
      <div
        ref={mobileStickyRef}
        className="sticky z-40 min-[1440px]:hidden"
        style={{ top: "var(--site-header-offset)" }}
      >
        <div className="glass-chip h-1.5 w-full overflow-hidden rounded-full">
          <div ref={mobileProgressRef} className="h-full rounded-full bg-accent" style={{ width: "0%" }} />
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((o) => !o)}
          aria-expanded={mobileOpen}
          className="glass-panel flex w-full items-center justify-between border-t-0 px-4 py-3"
        >
          <span className="pixel-text flex min-w-0 items-center gap-2.5 text-sm">
            <span
              className="shrink-0 text-accent transition-transform duration-200"
              style={{ display: "inline-block", transform: mobileOpen ? "rotate(90deg)" : "rotate(0deg)" }}
            >
              ▶
            </span>
            <span className="truncate font-medium text-foreground">{activeHeading?.text ?? t.blogIntroduction}</span>
          </span>
          <span className="section-title ml-3 shrink-0 text-[0.65rem] tracking-widest text-accent">
            {mobileOpen ? "[ ▲ ]" : "[ ▼ ]"}
          </span>
        </button>
      </div>

      {/* Mobile overlay: index + share — floats above article, no reflow */}
      {mobileOpen && (
        <>
          <button
            type="button"
            aria-label={t.blogCloseIndex}
            className="fixed inset-0 z-[48] bg-background/55 backdrop-blur-[2px] dark:bg-background/70"
            onClick={() => setMobileOpen(false)}
          />
          <div
            className="fixed left-3 right-3 z-[49] flex max-h-[min(72vh,calc(100dvh-env(safe-area-inset-bottom)-1rem))] flex-col overflow-hidden rounded-2xl border border-border/50 shadow-2xl sm:left-4 sm:right-4"
            style={{ top: mobilePanelTop }}
            role="dialog"
            aria-modal="true"
            aria-label={t.blogArticleSections}
          >
            <div className="glass-panel flex max-h-full min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border-0 p-0">
              <div className="border-b border-border/40 px-4 pb-2 pt-4">
                <div className="mb-2 flex items-center gap-2">
                  <span className="section-title text-xs tracking-widest text-accent">[ {t.blogIndexTitle} ]</span>
                  <span className="h-px flex-1 bg-border/70" />
                </div>
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-2">
                <nav aria-label={t.blogArticleSections}>
                  <NavList headings={headings} activeId={activeId} onPick={scrollTo} density="mobile" />
                </nav>
              </div>

              <div className="border-t border-border/40 bg-muted/20 px-3 py-3 dark:bg-muted/10">
                <p className="section-title mb-2.5 text-center text-[0.65rem] tracking-widest text-muted-foreground">
                  {t.blogShare}
                </p>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleShare("x")}
                    className="glass-chip flex flex-col items-center gap-1.5 rounded-xl py-3 ring-1 ring-border/40 transition hover:ring-accent/35"
                  >
                    <FaXTwitter size={20} className="text-foreground" />
                    <span className="pixel-text text-[0.65rem] text-muted-foreground">X</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleShare("linkedin")}
                    className="glass-chip flex flex-col items-center gap-1.5 rounded-xl py-3 ring-1 ring-border/40 transition hover:ring-accent/35"
                  >
                    <Linkedin size={20} className="text-foreground" />
                    <span className="pixel-text text-[0.6rem] text-muted-foreground">in</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleCopyLink()
                      setMobileOpen(false)
                    }}
                    className="glass-chip flex flex-col items-center gap-1.5 rounded-xl py-3 ring-1 ring-border/40 transition hover:ring-accent/35"
                  >
                    <Link2 size={20} className="text-foreground" />
                    <span className="pixel-text text-[0.65rem] text-muted-foreground">{t.blogCopyLink}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
