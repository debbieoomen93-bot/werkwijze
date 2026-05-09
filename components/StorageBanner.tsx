'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { translations } from '@/lib/translations'

export default function StorageBanner() {
  const { lang } = useLanguage()
  const text = translations.results.storage_banner[lang]

  return (
    <div
      className="rounded-xl px-4 py-3 text-sm font-medium leading-relaxed"
      style={{
        background: 'var(--yellow-pale)',
        border: '1.5px solid var(--yellow)',
        color: 'var(--ink)',
      }}
    >
      {text}
    </div>
  )
}
