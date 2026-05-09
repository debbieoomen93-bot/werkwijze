'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/contexts/LanguageContext'
import { translations } from '@/lib/translations'
import { storage } from '@/lib/storage'

export default function WelcomePage() {
  const { lang } = useLanguage()
  const router = useRouter()
  const tr = translations.welcome
  const [hasResults, setHasResults] = useState(false)

  useEffect(() => {
    setHasResults(storage.hasResults())
  }, [])

  function startFresh() {
    storage.clearAll()
    router.push('/wizard')
  }

  function continueSession() {
    router.push('/results')
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col justify-center px-4 py-10">
      <div className="max-w-5xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
          {/* Hero card */}
          <div
            className="rounded-2xl p-7 sm:p-9"
            style={{
              background: 'var(--card)',
              borderTop: '4px solid transparent',
              backgroundImage: 'linear-gradient(var(--card), var(--card)), linear-gradient(90deg, var(--rose), var(--peach), var(--yellow))',
              backgroundOrigin: 'border-box',
              backgroundClip: 'padding-box, border-box',
              boxShadow: '0 4px 32px rgba(30,26,46,0.1)',
            }}
          >
            <span
              className="inline-block text-xs font-bold px-3 py-1.5 rounded-full mb-5"
              style={{ background: 'var(--rose-pale)', color: 'var(--rose)' }}
            >
              {tr.badge[lang]}
            </span>

            <h1
              className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold leading-tight mb-4"
              style={{ color: 'var(--ink)', letterSpacing: '-0.03em' }}
            >
              {tr.h1[lang]}
            </h1>

            <p className="text-base sm:text-lg leading-relaxed mb-6" style={{ color: 'var(--muted)' }}>
              {tr.subtitle[lang]}
            </p>

            <div
              className="rounded-xl px-5 py-4 mb-7 italic text-sm leading-relaxed"
              style={{ background: 'var(--yellow-pale)', color: 'var(--ink)' }}
            >
              {tr.quip[lang].split('\n').map((line, i) => (
                <span key={i}>{line}{i === 0 && <br />}</span>
              ))}
            </div>

            <button
              onClick={startFresh}
              className="w-full sm:w-auto text-base font-bold px-8 py-4 rounded-xl transition-all min-h-[52px]"
              style={{
                background: 'var(--rose)',
                color: '#fff',
                boxShadow: '0 4px 16px rgba(232,99,122,0.35)',
              }}
            >
              {tr.cta[lang]}
            </button>

            {hasResults && (
              <div
                className="mt-5 flex flex-col sm:flex-row gap-3 items-start sm:items-center p-4 rounded-xl"
                style={{ background: 'var(--sage-pale)', border: '1.5px solid var(--sage-light)' }}
              >
                <span className="text-sm" style={{ color: 'var(--sage)' }}>
                  🔄 {tr.continue_banner[lang]}
                </span>
                <button
                  onClick={continueSession}
                  className="text-sm font-bold px-4 py-2 rounded-lg min-h-[40px]"
                  style={{ background: 'var(--sage)', color: '#fff' }}
                >
                  {tr.continue_btn[lang]}
                </button>
              </div>
            )}
          </div>

          {/* Stats column — hidden on mobile */}
          <div className="hidden lg:flex flex-col gap-4">
            {[
              { num: tr.stats.questions[lang], label: tr.stats.questions_label[lang], color: 'var(--rose)', bg: 'var(--rose-pale)', emoji: '🎯' },
              { num: tr.stats.matches[lang], label: tr.stats.matches_label[lang], color: 'var(--peach)', bg: 'var(--peach-pale)', emoji: '✨' },
              { num: tr.stats.vacancies[lang], label: tr.stats.vacancies_label[lang], color: 'var(--sky)', bg: 'var(--sky-light)', emoji: '💼' },
            ].map((s) => (
              <div
                key={s.label}
                className="flex items-center gap-4 rounded-2xl p-5"
                style={{ background: 'var(--card)', border: '1.5px solid var(--line)' }}
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ background: s.bg }}
                >
                  {s.emoji}
                </div>
                <div>
                  <div
                    className="text-3xl font-heading font-extrabold leading-none"
                    style={{ color: s.color }}
                  >
                    {s.num}
                  </div>
                  <div className="text-sm mt-1" style={{ color: 'var(--muted)' }}>
                    {s.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Feature chips */}
        <div className="flex flex-wrap gap-3 mt-8">
          {(tr.features[lang] as string[]).map((f) => (
            <span
              key={f}
              className="text-sm font-medium px-4 py-2 rounded-full"
              style={{ background: 'var(--card)', border: '1.5px solid var(--line)', color: 'var(--muted)' }}
            >
              {f}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
