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
  applicationName: "OB.log",
  authors: [{ name: "Ousama Beaj", url: "https://obeaj.me" }],
  creator: "Ousama Beaj",
  publisher: "Ousama Beaj",
  title: {
    default: "OB.log | Ousama Beaj",
    template: "%s | OB.log",
  },
  description:
    "Engineering notes and articles by Ousama Beaj — Next.js, React, fullstack, and product engineering.",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: {
    google: "0zJFKPIdoUK9TucvMXffaM8HLDIDvcD9ff-fIJeW8-8",
  },
  icons: {
    icon: [{ url: "/obeaj.svg", type: "image/svg+xml" }],
  },
  openGraph: {
    type: "website",
    url: baseUrl,
    siteName: "OB.log",
    title: "OB.log | Ousama Beaj",
    description:
      "Engineering notes and articles by Ousama Beaj — Next.js, React, fullstack, and product engineering.",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "OB.log | Ousama Beaj",
    description:
      "Engineering notes and articles by Ousama Beaj — Next.js, React, fullstack, and product engineering.",
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
