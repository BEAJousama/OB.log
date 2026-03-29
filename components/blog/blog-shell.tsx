"use client"

import type { ReactNode } from "react"
import { LanguageProvider } from "@/contexts/LanguageContext"
import { ThemeProvider } from "@/contexts/ThemeContext"
import { SoundProvider } from "@/contexts/SoundContext"
import { IntroProvider } from "@/contexts/IntroContext"
import ParticlesBackground from "@/components/particles-background"
import CustomCursor from "@/components/custom-cursor"
import BlogHeader from "@/components/blog/blog-header"
import BackgroundMusic from "@/components/background-music"
import SiteIntro from "@/components/site-intro"
import { useIntro } from "@/contexts/IntroContext"
import { cn } from "@/lib/utils"

type BlogShellProps = {
  children: ReactNode
}

function BlogMain({ children }: { children: ReactNode }) {
  const { introReady } = useIntro()
  return (
    <main
      aria-busy={!introReady}
      className={cn(
        "relative z-[1] mx-auto w-full max-w-5xl bg-transparent px-4 pb-16 pt-[calc(var(--site-header-offset)+1.5rem)] md:px-8",
        introReady ? "pointer-events-auto" : "pointer-events-none",
      )}
    >
      {children}
    </main>
  )
}

export default function BlogShell({ children }: BlogShellProps) {
  return (
    <SoundProvider>
      <ThemeProvider>
        <IntroProvider>
          <LanguageProvider>
            <div className="min-h-dvh bg-background text-foreground">
              <ParticlesBackground />
              <CustomCursor />
              <BackgroundMusic />
              <BlogHeader />
              <SiteIntro />
              <BlogMain>{children}</BlogMain>
            </div>
          </LanguageProvider>
        </IntroProvider>
      </ThemeProvider>
    </SoundProvider>
  )
}
