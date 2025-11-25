import type { Metadata } from "next"
import Link from "next/link"
import { Fraunces, Inter } from 'next/font/google'
import "./globals.css"
import BlockBackground from "@/components/BlockBackground"

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  weight: ['300', '400', '600', '700', '900'],
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: "Kieran Klaassen",
  description: "Thoughts on creativity, code, and craft.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body>
        <BlockBackground />

        <svg width="0" height="0" style={{ position: 'absolute' }}>
          <defs>
            <filter id="noise">
              <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" seed="5" />
              <feComponentTransfer>
                <feFuncA type="discrete" tableValues="0 0 0 0 1" />
              </feComponentTransfer>
              <feColorMatrix type="saturate" values="0.2" />
              <feBlend mode="soft-light" in="SourceGraphic" in2="SourceGraphic" />
            </filter>
          </defs>
        </svg>

        <header className="site-header">
          <div className="container">
            <div className="header-inner">
              <Link href="/" className="site-name">
                Kieran Klaassen
              </Link>
              <p className="site-tagline">
                Creator, engineer, composer, baker
              </p>
            </div>
          </div>
        </header>

        <main>{children}</main>

        <footer className="site-footer">
          <div className="container">
            <p className="footer-text">
              © {new Date().getFullYear()} Kieran Klaassen
            </p>
          </div>
        </footer>
      </body>
    </html>
  )
}
