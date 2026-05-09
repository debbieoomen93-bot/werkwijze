'use client'

import { useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { translations } from '@/lib/translations'
import type { JobMatch } from '@/lib/types'

interface Props {
  match: JobMatch
  rank: number
  selected: boolean
  onToggle: () => void
}

export default function JobMatchCard({ match, rank, selected, onToggle }: Props) {
  const { lang } = useLanguage()
  const [expanded, setExpanded] = useState(false)
  const tr = translations.results

  const title = lang === 'nl' ? match.title_nl : match.title_en
  const summary = lang === 'nl' ? match.summary_nl : match.summary_en
  const bullets = lang === 'nl' ? match.why_bullets_nl : match.why_bullets_en
  const tags = lang === 'nl' ? match.tags_nl : match.tags_en

  const scoreColor =
    match.match_score >= 90 ? 'var(--rose)' :
    match.match_score >= 75 ? 'var(--peach)' :
    'var(--sky)'

  return (
    <div
      className="rounded-2xl p-5 sm:p-6 card-hover"
      style={{
        background: 'var(--card)',
        border: selected ? '2px solid var(--rose)' : '1.5px solid var(--line)',
        boxShadow: selected ? '0 4px 24px rgba(232,99,122,0.15)' : '0 2px 8px rgba(30,26,46,0.06)',
      }}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <span
            className="text-xs font-semibold mb-1 block"
            style={{ color: 'var(--muted)' }}
          >
            #{rank}
          </span>
          <h3 className="text-lg font-heading font-bold leading-tight" style={{ color: 'var(--ink)' }}>
            {title}
          </h3>
          <span className="text-sm font-medium mt-0.5 block" style={{ color: 'var(--sage)' }}>
            {match.salary_indication}
          </span>
        </div>
        <div
          className="flex-shrink-0 text-sm font-bold px-3 py-1.5 rounded-full"
          style={{ background: scoreColor + '22', color: scoreColor }}
        >
          {match.match_score}%
        </div>
      </div>

      <div
        className="w-full h-1.5 rounded-full overflow-hidden mb-4"
        style={{ background: 'var(--line)' }}
      >
        <div
          className="h-full rounded-full"
          style={{
            width: `${match.match_score}%`,
            background: `linear-gradient(90deg, var(--rose), var(--peach))`,
          }}
        />
      </div>

      <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--muted)' }}>
        {summary}
      </p>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {tags.map((tag) => (
          <span
            key={tag}
            className="text-xs font-medium px-2.5 py-1 rounded-full"
            style={{ background: 'var(--sage-pale)', color: 'var(--sage)' }}
          >
            {tag}
          </span>
        ))}
      </div>

      <button
        onClick={() => setExpanded(!expanded)}
        className="text-sm font-semibold mb-3 transition-colors"
        style={{ color: 'var(--rose)' }}
      >
        {expanded ? tr.why_hide[lang] : tr.why_toggle[lang]} {expanded ? '▲' : '▼'}
      </button>

      {expanded && (
        <ul className="flex flex-col gap-2 mb-4 pl-2">
          {bullets.map((b, i) => (
            <li key={i} className="flex items-start gap-2 text-sm" style={{ color: 'var(--muted)' }}>
              <span style={{ color: 'var(--rose)', flexShrink: 0 }}>→</span>
              {b}
            </li>
          ))}
        </ul>
      )}

      <label className="flex items-center gap-2 cursor-pointer min-h-[40px] select-none">
        <input
          type="checkbox"
          checked={selected}
          onChange={onToggle}
          className="w-4 h-4 rounded"
          style={{ accentColor: 'var(--rose)' }}
        />
        <span className="text-sm font-medium" style={{ color: selected ? 'var(--rose)' : 'var(--muted)' }}>
          {tr.select_label[lang]}
        </span>
      </label>
    </div>
  )
}
