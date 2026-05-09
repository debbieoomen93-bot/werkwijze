'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { translations } from '@/lib/translations'
import type { Vacancy } from '@/lib/types'

interface Props {
  vacancy: Vacancy
}

export default function VacancyCard({ vacancy }: Props) {
  const { lang } = useLanguage()
  const tr = translations.vacancies

  const hasSalary = vacancy.salary_min !== null || vacancy.salary_max !== null

  function fmtSalary(min: number | null, max: number | null): string {
    if (min && max) return `€${min.toLocaleString()} – €${max.toLocaleString()}`
    if (min) return `v.a. €${min.toLocaleString()}`
    if (max) return `t/m €${max.toLocaleString()}`
    return ''
  }

  return (
    <div
      className="rounded-xl p-4 sm:p-5 card-hover"
      style={{
        background: 'var(--card)',
        border: '1.5px solid var(--line)',
      }}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">{vacancy.flag}</span>
            <span className="text-sm font-semibold truncate" style={{ color: 'var(--ink)' }}>
              {vacancy.title}
            </span>
          </div>
          <p className="text-xs" style={{ color: 'var(--muted)' }}>
            {vacancy.company} · {vacancy.location}
          </p>
        </div>
        {hasSalary && (
          <span
            className="flex-shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full"
            style={{ background: 'var(--sage-pale)', color: 'var(--sage)' }}
          >
            {fmtSalary(vacancy.salary_min, vacancy.salary_max)}
          </span>
        )}
      </div>

      {vacancy.description_snippet && (
        <p className="text-xs leading-relaxed mb-3" style={{ color: 'var(--muted)' }}>
          {vacancy.description_snippet}
        </p>
      )}

      <a
        href={vacancy.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block text-center text-sm font-semibold py-2.5 rounded-xl w-full transition-all min-h-[44px] flex items-center justify-center"
        style={{
          background: 'var(--rose)',
          color: '#fff',
        }}
      >
        {tr.view_btn[lang]}
      </a>
    </div>
  )
}
