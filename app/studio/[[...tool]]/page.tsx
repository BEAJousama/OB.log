import type { Metadata, Viewport } from "next"
import StudioClient from "./StudioClient"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "OB.log Studio",
  description: "Sanity Studio for OB.log",
  robots: { index: false, follow: false },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
}

export default function StudioPage() {
  return <StudioClient />
}
