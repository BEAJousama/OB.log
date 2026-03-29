"use client"

import { useLayoutEffect, useRef } from "react"
import { cn } from "@/lib/utils"
import { LoadingBrandMark } from "@/components/loading-brand-mark"
import {
  getLogoStartSizePx,
  LOGO_FLY_DURATION_MS,
  LOGO_FLY_EASING,
  LOGO_FLY_SETTLE_MS,
} from "@/lib/intro-constants"

const MAX_WAIT_FRAMES = 200

type LogoFlyToHeaderProps = {
  onDone: () => void
  theme: "light" | "dark"
}

function runFlip(inner: HTMLDivElement, target: HTMLElement) {
  const vw = window.innerWidth
  const vh = window.innerHeight
  const startPx = getLogoStartSizePx(vw)
  const cx0 = vw / 2
  const cy0 = vh / 2

  inner.style.width = `${startPx}px`
  inner.style.height = `${startPx}px`

  const tr = target.getBoundingClientRect()
  const tx = tr.left + tr.width / 2
  const ty = tr.top + tr.height / 2
  const scale = tr.width / startPx
  const dx = tx - cx0
  const dy = ty - cy0

  inner.style.transition = "none"
  inner.style.transform = "translate(-50%, -50%) translate(0px, 0px) scale(1)"

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      inner.style.transition = `transform ${LOGO_FLY_DURATION_MS}ms ${LOGO_FLY_EASING}`
      inner.style.transform = `translate(-50%, -50%) translate(${dx}px, ${dy}px) scale(${scale})`
    })
  })
}

export function LogoFlyToHeader({ onDone, theme }: LogoFlyToHeaderProps) {
  const innerRef = useRef<HTMLDivElement>(null)
  const finishedRef = useRef(false)

  useLayoutEffect(() => {
    finishedRef.current = false
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduced) {
      finishedRef.current = true
      onDone()
      return
    }

    let cancelled = false
    let finishTimer: number | undefined
    let frame = 0

    const attempt = () => {
      if (cancelled || finishedRef.current) return
      const inner = innerRef.current
      const target = document.querySelector("[data-header-logo-mark]") as HTMLElement | null

      if (inner && target) {
        runFlip(inner, target)
        finishTimer = window.setTimeout(() => {
          if (cancelled || finishedRef.current) return
          finishedRef.current = true
          onDone()
        }, LOGO_FLY_DURATION_MS + LOGO_FLY_SETTLE_MS)
        return
      }

      frame += 1
      if (frame > MAX_WAIT_FRAMES) {
        finishedRef.current = true
        onDone()
        return
      }
      requestAnimationFrame(attempt)
    }

    requestAnimationFrame(attempt)

    return () => {
      cancelled = true
      if (finishTimer) window.clearTimeout(finishTimer)
    }
  }, [onDone])

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-0 z-[10001] bg-transparent",
        theme === "dark" && "dark",
      )}
      aria-hidden
    >
      <div
        ref={innerRef}
        className="absolute left-1/2 top-1/2 will-change-transform"
        style={{ transform: "translate(-50%, -50%) scale(1)" }}
      >
        <LoadingBrandMark spinArc className="h-full w-full max-h-none max-w-none" />
      </div>
    </div>
  )
}
