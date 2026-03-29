"use client"

import { useEffect } from "react"
import { useCursorLux } from "@/contexts/CursorLuxContext"

const LUX_TARGET_SELECTOR = ".glass-panel, .glass-chip, .glass-inset, .skill-item"

export default function CursorLuxTracker() {
  const { cursorLuxEnabled } = useCursorLux()

  useEffect(() => {
    if (!cursorLuxEnabled) return

    const mqFine = window.matchMedia("(pointer: fine)")
    const mqReduced = window.matchMedia("(prefers-reduced-motion: reduce)")
    if (!mqFine.matches || mqReduced.matches) return

    let rafId = 0
    let nextX = 0
    let nextY = 0
    let nextTarget: EventTarget | null = null
    let hasPending = false
    let activeEl: HTMLElement | null = null

    const clearActive = () => {
      if (!activeEl) return
      activeEl.classList.remove("lux-active")
      activeEl.style.removeProperty("--lux-x")
      activeEl.style.removeProperty("--lux-y")
      activeEl = null
    }

    const paint = () => {
      rafId = 0
      if (!hasPending) return
      hasPending = false

      const origin = nextTarget instanceof HTMLElement ? nextTarget : null
      const target = origin?.closest(LUX_TARGET_SELECTOR) as HTMLElement | null

      if (!target) {
        clearActive()
        return
      }

      if (activeEl && activeEl !== target) {
        clearActive()
      }

      const rect = target.getBoundingClientRect()
      const x = nextX - rect.left
      const y = nextY - rect.top

      target.style.setProperty("--lux-x", `${x}px`)
      target.style.setProperty("--lux-y", `${y}px`)
      target.classList.add("lux-active")
      activeEl = target
    }

    const onPointerMove = (e: PointerEvent) => {
      nextX = e.clientX
      nextY = e.clientY
      nextTarget = e.target
      hasPending = true
      if (!rafId) rafId = window.requestAnimationFrame(paint)
    }

    const onPointerLeaveWindow = (e: PointerEvent) => {
      const related = e.relatedTarget as Node | null
      if (!related) clearActive()
    }

    window.addEventListener("pointermove", onPointerMove, { passive: true })
    document.addEventListener("pointerout", onPointerLeaveWindow, { passive: true })

    return () => {
      window.removeEventListener("pointermove", onPointerMove)
      document.removeEventListener("pointerout", onPointerLeaveWindow)
      if (rafId) window.cancelAnimationFrame(rafId)
      clearActive()
    }
  }, [cursorLuxEnabled])

  return null
}
