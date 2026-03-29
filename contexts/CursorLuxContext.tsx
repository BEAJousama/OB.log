"use client"

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react"

type CursorLuxContextType = {
  cursorLuxEnabled: boolean
  toggleCursorLux: () => void
}

const STORAGE_KEY = "cursorLuxEnabled_v1"

const CursorLuxContext = createContext<CursorLuxContextType | undefined>(undefined)

export function CursorLuxProvider({ children }: { children: ReactNode }) {
  const [cursorLuxEnabled, setCursorLuxEnabled] = useState(true)

  useEffect(() => {
    if (typeof window === "undefined") return
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved !== null) {
      setCursorLuxEnabled(saved === "true")
    }
  }, [])

  useEffect(() => {
    if (typeof document === "undefined") return
    document.documentElement.classList.toggle("cursor-lux-enabled", cursorLuxEnabled)
  }, [cursorLuxEnabled])

  const toggleCursorLux = () => {
    setCursorLuxEnabled((prev) => {
      const next = !prev
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, String(next))
      }
      return next
    })
  }

  const value = useMemo(
    () => ({
      cursorLuxEnabled,
      toggleCursorLux,
    }),
    [cursorLuxEnabled],
  )

  return <CursorLuxContext.Provider value={value}>{children}</CursorLuxContext.Provider>
}

export function useCursorLux() {
  const ctx = useContext(CursorLuxContext)
  if (!ctx) {
    throw new Error("useCursorLux must be used within CursorLuxProvider")
  }
  return ctx
}
