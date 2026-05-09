'use client'

import { useEffect, useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { translations } from '@/lib/translations'

export default function LoadingScreen() {
  const { lang } = useLanguage()
  const tr = translations.loading
  const messages = tr.messages[lang]
  const [msgIdx, setMsgIdx] = useState(0)
  const [progress, setProgress] = useState(5)

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIdx((i) => (i + 1) % messages.length)
    }, 2500)
    return () => clearInterval(interval)
  }, [messages.length])

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => (p >= 92 ? p : p + Math.random() * 4))
    }, 800)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div
        className="w-full max-w-[440px] rounded-2xl p-8 text-center"
        style={{
          background: 'var(--card)',
          boxShadow: '0 4px 32px rgba(30,26,46,0.12)',
        }}
      >
        <h1 className="text-xl font-heading font-bold mb-6" style={{ color: 'var(--ink)' }}>
          {tr.title[lang]}
        </h1>

        <div className="flex justify-center gap-3 mb-8">
          {(['var(--rose)', 'var(--peach)', 'var(--yellow)'] as const).map((color, i) => (
            <div
              key={i}
              className="w-3 h-3 rounded-full"
              style={{
                background: color,
                animation: `bounce-dot 1.4s ease infinite`,
                animationDelay: `${i * 0.16}s`,
              }}
            />
          ))}
        </div>

        <div
          className="w-full h-2 rounded-full overflow-hidden mb-6"
          style={{ background: 'var(--line)' }}
        >
          <div
            className="h-full rounded-full gradient-progress transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p
          className="text-sm font-medium mb-6 min-h-[40px] flex items-center justify-center text-center px-2"
          style={{ color: 'var(--muted)' }}
        >
          {messages[msgIdx]}
        </p>

        <p className="text-xs italic" style={{ color: 'var(--muted)' }}>
          {tr.footnote[lang]}
        </p>
      </div>
    </div>
  )
}
