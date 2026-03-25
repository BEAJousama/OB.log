import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono, Press_Start_2P } from "next/font/google"
import "./globals.css"

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" })
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" })
const pressStart2P = Press_Start_2P({ weight: "400", subsets: ["latin"], variable: "--font-game" })

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://blog.obeaj.me"

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "OB.log | Ousama Beaj",
    template: "%s | OB.log",
  },
  description:
    "Engineering notes and articles by Ousama Beaj — Next.js, React, fullstack, and product engineering.",
  openGraph: {
    type: "website",
    url: baseUrl,
    siteName: "OB.log",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geist.variable} ${geistMono.variable} ${pressStart2P.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  )
}
