"use client"

import { createContext, useContext, useMemo, useState, type Dispatch, type SetStateAction } from "react"

type IntroContextType = {
  introReady: boolean
  setIntroReady: Dispatch<SetStateAction<boolean>>
}

const IntroContext = createContext<IntroContextType | undefined>(undefined)

export function IntroProvider({ children }: { children: React.ReactNode }) {
  const [introReady, setIntroReady] = useState(false)

  const value = useMemo(() => ({ introReady, setIntroReady }), [introReady])

  return <IntroContext.Provider value={value}>{children}</IntroContext.Provider>
}

export function useIntro() {
  const ctx = useContext(IntroContext)
  if (!ctx) {
    throw new Error("useIntro must be used within IntroProvider")
  }
  return ctx
}
