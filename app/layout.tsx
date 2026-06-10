import type { Metadata } from "next"
import "./globals.css"
import { Analytics } from '@vercel/analytics/react'
import BottomNav from '@/components/BottomNav'

export const metadata: Metadata = {
  title: "What are we doing?",
  description: "Pick your vibe, pass the phone, see where you match. Dublin activity ideas for two.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/dist/tabler-icons.min.css"
        />
      </head>
      <body className="antialiased">
        {children}
        <BottomNav />
        <Analytics />
      </body>
    </html>
  )
}
