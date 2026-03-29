"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

/** Tight halo so the ring hugs the control (not a large margin). */
const HOVER_PADDING_PX = 4

const CLICKABLE_SELECTOR =
  "a[href], button, [role='button'], [role='menuitem'], [role='option'], .retro-button, .sidebar-icon, .social-icon, input:not([type='hidden']), textarea, select, summary, label[for]"

function useFinePointerNoReducedMotion(): boolean {
  const [ok, setOk] = useState(false)

  useEffect(() => {
    const mqFine = window.matchMedia("(pointer: fine)")
    const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)")

    const sync = () => setOk(mqFine.matches && !mqReduce.matches)

    sync()
    mqFine.addEventListener("change", sync)
    mqReduce.addEventListener("change", sync)
    return () => {
      mqFine.removeEventListener("change", sync)
      mqReduce.removeEventListener("change", sync)
    }
  }, [])

  return ok
}

export default function CustomCursor() {
  const enabled = useFinePointerNoReducedMotion()
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [hover, setHover] = useState<{
    width: number
    height: number
    borderRadius: string
  } | null>(null)

  useEffect(() => {
    if (!enabled) return

    const updateCursor = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const clickable = target.closest(CLICKABLE_SELECTOR) as HTMLElement | null

      if (clickable && !clickable.closest("[data-cursor-default]")) {
        const rect = clickable.getBoundingClientRect()
        const cs = window.getComputedStyle(clickable)
        let radius = cs.borderRadius
        if (!radius || radius === "0px") {
          radius = "1rem"
        }
        setHover({
          width: rect.width + HOVER_PADDING_PX,
          height: rect.height + HOVER_PADDING_PX,
          borderRadius: radius,
        })
        setPosition({
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        })
      } else {
        setHover(null)
        setPosition({ x: e.clientX, y: e.clientY })
      }
    }

    window.addEventListener("mousemove", updateCursor, { passive: true })

    return () => {
      window.removeEventListener("mousemove", updateCursor)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <div
      className={cn("custom-cursor", hover && "custom-cursor--hover")}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: hover ? `${hover.width}px` : "22px",
        height: hover ? `${hover.height}px` : "22px",
        borderRadius: hover ? hover.borderRadius : undefined,
      }}
    >
      <span className="custom-cursor__dot" aria-hidden />
    </div>
  )
}
