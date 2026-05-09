import type { Metadata } from 'next'
import { Bricolage_Grotesque, Mulish } from 'next/font/google'
import './globals.css'
import { LanguageProvider } from '@/contexts/LanguageContext'
import Nav from '@/components/Nav'

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['700', '800'],
  variable: '--font-bricolage',
  display: 'swap',
})

const mulish = Mulish({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-mulish',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'WerkWijzer — Ontdek jouw ideale carrière',
  description:
    'Ontdek welke functies bij jou passen met slimme AI-analyse en vind direct vacatures.',
  keywords: 'carrière, werk, vacatures, AI, loopbaan, baan, oriëntatie',
  openGraph: {
    title: 'WerkWijzer',
    description: 'Uitzoeken wat jij wil doen. Zonder gedoe.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="nl" className={`${bricolage.variable} ${mulish.variable}`}>
      <body className="min-h-screen bg-[var(--bg)] font-body">
        <LanguageProvider>
          <Nav />
          <main className="pt-16">{children}</main>
        </LanguageProvider>
      </body>
    </html>
  )
}
