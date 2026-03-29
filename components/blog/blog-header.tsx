"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Sun, Moon, Volume2, VolumeX, Menu, X, ChevronDown, Lightbulb, LightbulbOff } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"
import { useTheme } from "@/contexts/ThemeContext"
import { useSound } from "@/hooks/use-sound"
import { useSoundSettings } from "@/contexts/SoundContext"
import { useCursorLux } from "@/contexts/CursorLuxContext"
import { useIntro } from "@/contexts/IntroContext"
import type { Language } from "@/lib/translations"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import ObeajMark from "@/components/brand/obeaj-mark"

const PORTFOLIO_URL = (process.env.NEXT_PUBLIC_PORTFOLIO_URL || "https://obeaj.me").replace(/\/$/, "")

function IconToolbarButton({
  onClick,
  label,
  active = false,
  children,
}: {
  onClick: () => void
  label: string
  active?: boolean
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex size-10 shrink-0 items-center justify-center rounded-full ring-1 transition sm:size-11",
        active
          ? "text-accent ring-accent/35 [filter:drop-shadow(0_0_6px_rgba(184,163,124,0.6))]"
          : "text-muted-foreground ring-border/50 hover:bg-muted hover:text-foreground hover:ring-border",
      )}
      title={label}
      aria-label={label}
      aria-pressed={active}
    >
      {children}
    </button>
  )
}

export default function BlogHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const logoArcRotateRef = useRef<SVGGElement | null>(null)
  const docScrollRangeRef = useRef(1)
  const lastScrollBucketRef = useRef<number | null>(null)
  const headerBarRef = useRef<HTMLDivElement>(null)
  const [logoArcUsesScrollTimeline, setLogoArcUsesScrollTimeline] = useState(false)
  const [menuTopPx, setMenuTopPx] = useState(108)
  const [isMobile, setIsMobile] = useState(false)
  const [hasFinePointer, setHasFinePointer] = useState(false)
  const { language, setLanguage, t } = useLanguage()
  const { theme, toggleTheme } = useTheme()
  const { playClick, playScrollTick } = useSound()
  const { uiSoundEnabled, toggleUiSound } = useSoundSettings()
  const { cursorLuxEnabled, toggleCursorLux } = useCursorLux()
  const { introReady } = useIntro()
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const el = headerBarRef.current
    if (!el) return
    const measure = () => {
      const r = el.getBoundingClientRect()
      setMenuTopPx(Math.round(r.bottom + 8))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    window.addEventListener("resize", measure)
    return () => {
      ro.disconnect()
      window.removeEventListener("resize", measure)
    }
  }, [])

  useEffect(() => {
    const updateRange = () => {
      docScrollRangeRef.current = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
    }
    updateRange()
    const ro = new ResizeObserver(updateRange)
    ro.observe(document.documentElement)
    window.addEventListener("resize", updateRange, { passive: true })
    window.visualViewport?.addEventListener("resize", updateRange)
    return () => {
      ro.disconnect()
      window.removeEventListener("resize", updateRange)
      window.visualViewport?.removeEventListener("resize", updateRange)
    }
  }, [])

  useEffect(() => {
    if (typeof CSS === "undefined" || typeof window === "undefined") return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setLogoArcUsesScrollTimeline(false)
      return
    }
    const ok =
      CSS.supports("animation-timeline: scroll(root)") ||
      CSS.supports("animation-timeline: scroll(root block)")
    setLogoArcUsesScrollTimeline(ok)
  }, [])

  useEffect(() => {
    if (!logoArcUsesScrollTimeline) return
    logoArcRotateRef.current?.style.removeProperty("transform")
  }, [logoArcUsesScrollTimeline])

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 767px)")
    const handler = () => setIsMobile(mql.matches)
    handler()
    mql.addEventListener("change", handler)
    return () => mql.removeEventListener("change", handler)
  }, [])

  useEffect(() => {
    const mql = window.matchMedia("(pointer: fine)")
    const onChange = () => setHasFinePointer(mql.matches)
    onChange()
    mql.addEventListener("change", onChange)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  useEffect(() => {
    if (!isMobile) {
      setMobileMenuOpen(false)
    }
  }, [isMobile])

  useEffect(() => {
    if (isMobile && mobileMenuOpen) {
      const prev = document.body.style.overflow
      document.body.style.overflow = "hidden"
      return () => {
        document.body.style.overflow = prev
      }
    }
  }, [isMobile, mobileMenuOpen])

  useEffect(() => {
    let rafId = 0
    let scrollPending = false

    const applyScroll = () => {
      scrollPending = false
      const scrollTop = window.scrollY
      const progress = Math.min(scrollTop / docScrollRangeRef.current, 1)

      if (!logoArcUsesScrollTimeline) {
        const g = logoArcRotateRef.current
        if (g) {
          g.style.transform = `rotate(${progress * 360}deg)`
        }
      }

      const bucket = Math.floor(progress * 10)
      if (bucket > 0 && bucket !== lastScrollBucketRef.current) {
        lastScrollBucketRef.current = bucket
        if (uiSoundEnabled) {
          playScrollTick()
        }
      }
    }

    const onScroll = () => {
      if (scrollPending) return
      scrollPending = true
      rafId = requestAnimationFrame(applyScroll)
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    applyScroll()

    return () => {
      window.removeEventListener("scroll", onScroll)
      cancelAnimationFrame(rafId)
    }
  }, [logoArcUsesScrollTimeline, uiSoundEnabled, playScrollTick])

  const navPillBase =
    "relative shrink-0 whitespace-nowrap rounded-full px-3.5 py-2 text-xs sm:text-sm font-medium tracking-wide transition-all duration-200"

  const themeLabel = theme === "light" ? t.switchToDarkTheme : t.switchToLightTheme
  const soundLabel = uiSoundEnabled ? t.muteUiSounds : t.enableUiSounds

  const onThemeClick = () => {
    if (uiSoundEnabled) playClick()
    toggleTheme()
  }

  const onSoundClick = () => {
    playClick()
    toggleUiSound()
  }

  const onLuxClick = () => {
    if (uiSoundEnabled) playClick()
    toggleCursorLux()
  }

  return (
    <>
      <header className="pointer-events-none fixed left-0 right-0 top-2 z-50 px-3 pt-3 sm:top-3 sm:px-5 sm:pt-4 md:top-4 md:px-6 md:pt-5">
        <div
          ref={headerBarRef}
          className="pointer-events-auto glass-panel mx-auto flex max-w-6xl items-center gap-2 rounded-3xl px-2.5 py-2.5 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.14)] dark:shadow-[0_16px_48px_-16px_rgba(0,0,0,0.55)] sm:gap-3 sm:px-4 sm:py-3 md:gap-4 md:px-5 md:py-3.5"
        >
          <div className="flex min-w-0 shrink-0 items-center gap-2.5 sm:gap-3 md:gap-3.5">
            <div className="relative shrink-0">
              <div
                className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-accent/30 via-transparent to-accent/15 opacity-90 blur-[2px]"
                aria-hidden
              />
              <Link
                href="/"
                data-header-logo-button
                onClick={() => {
                  if (uiSoundEnabled) playClick()
                }}
                className="glass-chip relative flex size-14 items-center justify-center rounded-2xl ring-1 ring-border/50 transition hover:border-accent/35 hover:ring-accent/45 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:size-16"
                aria-label={t.blogTitle}
              >
                <ObeajMark
                  data-header-logo-mark=""
                  rotateGroupRef={logoArcRotateRef}
                  arcScrollTimeline={logoArcUsesScrollTimeline}
                  className={cn(
                    "size-11 transition-opacity duration-200 sm:size-[3.25rem]",
                    introReady ? "opacity-100" : "opacity-0",
                  )}
                />
              </Link>
            </div>
            <Link
              href="/"
              onClick={() => {
                if (uiSoundEnabled) playClick()
              }}
              className="section-title min-w-0 truncate text-sm leading-tight text-foreground sm:text-base md:text-lg"
            >
              {t.blogTitle}
            </Link>
          </div>

          <nav
            className="hidden min-w-0 flex-1 items-center justify-center gap-2 overflow-x-auto py-2 md:flex [&::-webkit-scrollbar]:hidden"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            aria-label="Primary"
          >
            <Link
              href="/"
              onClick={() => {
                if (uiSoundEnabled) playClick()
              }}
              className={cn(
                navPillBase,
                pathname === "/"
                  ? "bg-accent/26 text-foreground ring-1 ring-accent/35 shadow-[inset_0_0_0_1px_rgba(184,163,124,0.25)]"
                  : "text-muted-foreground hover:text-foreground hover:ring-1 hover:ring-border/45",
              )}
            >
              {t.home}
            </Link>
            <a
              href={PORTFOLIO_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                if (uiSoundEnabled) playClick()
              }}
              className="shrink-0 whitespace-nowrap rounded-full px-3.5 py-2 text-xs font-medium tracking-wide text-foreground transition hover:text-foreground hover:ring-1 hover:ring-border/45 sm:text-sm"
            >
              {t.blogNavPortfolioLink}
              <span className="ml-0.5 opacity-70" aria-hidden>
                ↗
              </span>
            </a>
          </nav>

          <div className="ml-auto flex items-center gap-1 sm:gap-1.5">
            <div className="segmented-control hidden lg:flex" role="group" aria-label={t.languageMenu}>
              <div
                className="segmented-control__capsule"
                style={{ transform: `translateX(${language === "fr" ? 100 : 0}%)` }}
                aria-hidden
              />
              <button
                type="button"
                onClick={() => {
                  if (uiSoundEnabled) playClick()
                  setLanguage("en")
                  router.refresh()
                }}
                className={cn(
                  "segmented-control__item",
                  language === "en" ? "segmented-control__item--active" : "segmented-control__item--idle",
                )}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => {
                  if (uiSoundEnabled) playClick()
                  setLanguage("fr")
                  router.refresh()
                }}
                className={cn(
                  "segmented-control__item",
                  language === "fr" ? "segmented-control__item--active" : "segmented-control__item--idle",
                )}
              >
                FR
              </button>
            </div>

            <div className="hidden items-center gap-0.5 sm:gap-1 lg:flex" aria-label={t.quickSettings}>
              <IconToolbarButton onClick={onThemeClick} label={themeLabel}>
                {theme === "light" ? (
                  <Moon size={18} strokeWidth={1.85} />
                ) : (
                  <Sun size={18} strokeWidth={1.85} />
                )}
              </IconToolbarButton>
              <IconToolbarButton onClick={onSoundClick} label={soundLabel}>
                {uiSoundEnabled ? (
                  <Volume2 size={18} strokeWidth={1.85} />
                ) : (
                  <VolumeX size={18} strokeWidth={1.85} />
                )}
              </IconToolbarButton>
              {hasFinePointer && (
                <IconToolbarButton
                  onClick={onLuxClick}
                  label={cursorLuxEnabled ? t.disableCursorLight : t.enableCursorLight}
                  active={cursorLuxEnabled}
                >
                  {cursorLuxEnabled ? <Lightbulb size={18} strokeWidth={1.85} /> : <LightbulbOff size={18} strokeWidth={1.85} />}
                </IconToolbarButton>
              )}
            </div>

            <div className="flex items-center gap-0.5 lg:hidden" aria-label={t.quickSettings}>
              <IconToolbarButton onClick={onThemeClick} label={themeLabel}>
                {theme === "light" ? (
                  <Moon size={17} strokeWidth={1.85} />
                ) : (
                  <Sun size={17} strokeWidth={1.85} />
                )}
              </IconToolbarButton>
              <IconToolbarButton onClick={onSoundClick} label={soundLabel}>
                {uiSoundEnabled ? (
                  <Volume2 size={17} strokeWidth={1.85} />
                ) : (
                  <VolumeX size={17} strokeWidth={1.85} />
                )}
              </IconToolbarButton>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className={cn(
                      "flex h-9 min-w-[3.25rem] shrink-0 items-center justify-center gap-0.5 rounded-full px-2 text-muted-foreground ring-1 ring-border/50 transition hover:bg-muted hover:text-foreground hover:ring-border sm:h-10",
                      "pixel-text text-[0.65rem] font-bold uppercase tracking-wider",
                    )}
                    aria-label={t.languageMenu}
                  >
                    {language}
                    <ChevronDown className="size-3.5 shrink-0 opacity-70" aria-hidden />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  sideOffset={6}
                  className="glass-panel z-[100] min-w-[10rem] border-border/60 p-1 shadow-lg"
                >
                  <DropdownMenuRadioGroup
                    value={language}
                    onValueChange={(v) => {
                      if (uiSoundEnabled) playClick()
                      setLanguage(v as Language)
                      router.refresh()
                    }}
                  >
                    <DropdownMenuRadioItem value="en" className="pixel-text cursor-pointer text-sm">
                      EN
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="fr" className="pixel-text cursor-pointer text-sm">
                      FR
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <button
              type="button"
              onClick={() => {
                if (uiSoundEnabled) playClick()
                setMobileMenuOpen(!mobileMenuOpen)
              }}
              className="flex size-10 items-center justify-center rounded-full bg-muted/70 text-foreground ring-2 ring-border/60 transition hover:bg-muted sm:size-11 lg:hidden"
              aria-expanded={mobileMenuOpen}
              aria-label={t.menu}
            >
              {mobileMenuOpen ? <X size={20} strokeWidth={2} /> : <Menu size={20} strokeWidth={2} />}
            </button>
          </div>
        </div>
      </header>

      {isMobile && (
        <nav
          className={cn(
            "fixed left-0 right-0 z-40 transition-all duration-300 ease-out",
            mobileMenuOpen
              ? "pointer-events-auto translate-y-0 opacity-100"
              : "pointer-events-none -translate-y-3 opacity-0",
          )}
          style={{
            top: menuTopPx,
            paddingLeft: "1rem",
            paddingRight: "1rem",
            paddingBottom: "1rem",
          }}
          aria-hidden={!mobileMenuOpen}
        >
          <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl border border-border/70 bg-background/95 p-4 shadow-xl backdrop-blur-xl dark:border-border/80 dark:bg-card/95">
            <div className="flex flex-col gap-1">
              <Link
                href="/"
                onClick={() => {
                  if (uiSoundEnabled) playClick()
                  setMobileMenuOpen(false)
                }}
                style={{ transition: "all 0.25s ease-out" }}
                className={cn(
                  "rounded-xl px-3 py-3 text-left text-sm font-medium tracking-wide transition",
                  pathname === "/"
                    ? "bg-accent/35 text-foreground ring-2 ring-accent/40"
                    : "text-foreground hover:bg-muted/80",
                )}
              >
                {t.home}
              </Link>
              <a
                href={PORTFOLIO_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  if (uiSoundEnabled) playClick()
                  setMobileMenuOpen(false)
                }}
                style={{ transition: "all 0.25s ease-out 0.04s" }}
                className="rounded-xl px-3 py-3 text-left text-sm font-medium text-foreground hover:bg-accent/20"
              >
                {t.blogNavPortfolioLink}
                <span className="ml-1 opacity-70" aria-hidden>
                  ↗
                </span>
              </a>
            </div>
          </div>
        </nav>
      )}
    </>
  )
}
