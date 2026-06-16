import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/providers"
import { Navbar } from "@/components/shared/navbar"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  metadataBase: new URL("https://irfanariff.com"),
  title: "Irfan Ariff — Software Developer",
  description:
    "I build websites, web apps, dashboards, and full-stack systems for businesses.",
  openGraph: {
    title: "Irfan Ariff — Software Developer",
    description:
      "Websites, web apps, dashboards, and full-stack systems for businesses.",
    url: "https://irfanariff.com",
    siteName: "Irfan Ariff",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Irfan Ariff — Software Developer",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Irfan Ariff — Software Developer",
    description:
      "I build websites, web apps, dashboards, and full-stack systems for businesses.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/file.svg",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen bg-zinc-950 font-sans text-zinc-100 antialiased">
        <Providers>
          <Navbar />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  )
}
