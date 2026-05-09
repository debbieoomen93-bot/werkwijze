'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { translations } from '@/lib/translations'
import type { AnalysisResult } from '@/lib/types'

interface Props {
  results: AnalysisResult
}

export default function ProfileCard({ results }: Props) {
  const { lang } = useLanguage()
  const tr = translations.results
  const profile = lang === 'nl' ? results.overall_profile_nl : results.overall_profile_en
  const tags = lang === 'nl' ? results.profile_tags_nl : results.profile_tags_en

  return (
    <div
      className="relative overflow-hidden rounded-2xl p-6 sm:p-8"
      style={{
        background: 'var(--ink)',
        color: '#fff',
      }}
    >
      <div
        className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10 pointer-events-none"
        style={{ background: 'var(--rose)', transform: 'translate(30%, -30%)' }}
      />
      <div
        className="absolute bottom-0 left-0 w-32 h-32 rounded-full opacity-10 pointer-events-none"
        style={{ background: 'var(--peach)', transform: 'translate(-20%, 20%)' }}
      />
      <div className="relative z-10">
        <h2 className="text-lg font-heading font-bold mb-3" style={{ color: '#e8d8f8' }}>
          {tr.profile_title[lang]}
        </h2>
        <p className="text-sm leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.8)' }}>
          {profile}
        </p>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-xs font-semibold px-3 py-1.5 rounded-full"
              style={{ background: 'var(--rose)', color: '#fff' }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
