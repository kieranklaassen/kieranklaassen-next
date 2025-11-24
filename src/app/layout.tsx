import type { Metadata } from "next"
import Link from "next/link"
import "./globals.css"

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
    <html lang="en">
      <body>
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
