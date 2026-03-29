"use client"

import { useCallback, useEffect, useLayoutEffect, useState } from "react"
import { useIntro } from "@/contexts/IntroContext"
import { getIntroTheme } from "@/lib/intro-theme"
import { LoadingBrandMark } from "@/components/loading-brand-mark"
import { LogoFlyToHeader } from "@/components/logo-fly-to-header"
import { cn } from "@/lib/utils"

const LOADING_MS = 2000

type Phase = "loading" | "fly" | "done"

function reducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

export default function SiteIntro() {
  const { setIntroReady } = useIntro()
  const [phase, setPhase] = useState<Phase>("loading")
  const [introTheme, setIntroTheme] = useState<"light" | "dark">("dark")

  useLayoutEffect(() => {
    setIntroTheme(getIntroTheme())
  }, [])

  useLayoutEffect(() => {
    if (reducedMotion()) {
      document.documentElement.setAttribute("data-intro-ready", "true")
      setIntroReady(true)
      setPhase("done")
    }
  }, [setIntroReady])

  useEffect(() => {
    if (phase !== "loading") return
    if (reducedMotion()) return

    const t = window.setTimeout(() => {
      document.documentElement.setAttribute("data-intro-fly", "true")
      setPhase("fly")
    }, LOADING_MS)

    return () => window.clearTimeout(t)
  }, [phase])

  const finishIntro = useCallback(() => {
    document.documentElement.setAttribute("data-intro-ready", "true")
    setIntroReady(true)
    setPhase("done")
  }, [setIntroReady])

  if (phase === "done") return null

  return (
    <>
      {phase === "loading" && (
        <div
          className={cn(
            "fixed inset-0 z-[10000] flex min-h-dvh items-center justify-center bg-background text-foreground",
            introTheme === "dark" && "dark",
          )}
          role="status"
          aria-live="polite"
          aria-busy="true"
        >
          <div className="flex h-[200px] w-[200px] shrink-0 items-center justify-center sm:h-[240px] sm:w-[240px]">
            <LoadingBrandMark spinArc className="h-full w-full" />
          </div>
        </div>
      )}

      {phase === "fly" && <LogoFlyToHeader theme={introTheme} onDone={finishIntro} />}
    </>
  )
}
