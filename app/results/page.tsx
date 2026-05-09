'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/contexts/LanguageContext'
import { translations } from '@/lib/translations'
import { storage } from '@/lib/storage'
import type { AnalysisResult } from '@/lib/types'
import StorageBanner from '@/components/StorageBanner'
import ProfileCard from '@/components/ProfileCard'
import JobMatchCard from '@/components/JobMatchCard'
import PdfExportButton from '@/components/PdfExportButton'

export default function ResultsPage() {
  const { lang } = useLanguage()
  const router = useRouter()
  const tr = translations.results
  const [results, setResults] = useState<AnalysisResult | null>(null)
  const [selected, setSelected] = useState<string[]>([])

  useEffect(() => {
    const r = storage.getResults()
    if (!r) {
      router.push('/')
      return
    }
    setResults(r)
    setSelected(storage.getSelected())
  }, [router])

  function toggleSelect(titleKey: string) {
    setSelected((prev) => {
      const next = prev.includes(titleKey)
        ? prev.filter((t) => t !== titleKey)
        : [...prev, titleKey]
      storage.setSelected(next)
      return next
    })
  }

  function handleFindVacancies() {
    router.push('/vacancies')
  }

  function handleRestart() {
    storage.clearAll()
    router.push('/')
  }

  if (!results) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p style={{ color: 'var(--muted)' }}>{tr.error_no_results[lang]}</p>
      </div>
    )
  }

  const selectedCount = selected.length

  return (
    <div className="min-h-[calc(100vh-64px)] px-4 py-8 pb-28">
      <div className="max-w-[740px] mx-auto">
        <StorageBanner />

        <div className="mt-6 mb-4">
          <h1 className="text-3xl font-heading font-extrabold" style={{ color: 'var(--ink)' }}>
            {tr.title[lang]}
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>
            {tr.subtitle[lang]}
          </p>
        </div>

        <div className="mb-6">
          <ProfileCard results={results} />
        </div>

        <div className="flex flex-col gap-4 mb-8">
          {results.matches
            .sort((a, b) => b.match_score - a.match_score)
            .map((match, i) => {
              const titleKey = lang === 'nl' ? match.title_nl : match.title_en
              return (
                <JobMatchCard
                  key={match.title_nl}
                  match={match}
                  rank={i + 1}
                  selected={selected.includes(titleKey)}
                  onToggle={() => toggleSelect(titleKey)}
                />
              )
            })}
        </div>

        <div className="flex justify-center mb-8">
          <button
            onClick={handleRestart}
            className="text-sm font-medium underline"
            style={{ color: 'var(--muted)' }}
          >
            {tr.restart[lang]}
          </button>
        </div>
      </div>

      {/* Sticky bottom bar */}
      <div
        className="fixed bottom-0 left-0 right-0 px-4 py-3 flex items-center gap-3"
        style={{
          background: 'rgba(240,235,248,0.95)',
          backdropFilter: 'blur(12px)',
          borderTop: '1.5px solid var(--line)',
        }}
      >
        <div className="max-w-[740px] mx-auto w-full flex items-center gap-3">
          <span className="text-sm flex-1" style={{ color: 'var(--muted)' }}>
            {selectedCount} {tr.selected_count[lang]}
          </span>
          <PdfExportButton results={results} />
          <button
            onClick={handleFindVacancies}
            disabled={selectedCount === 0}
            className="text-sm font-bold px-5 py-2.5 rounded-xl min-h-[44px] transition-all"
            style={{
              background: selectedCount > 0 ? 'var(--rose)' : 'var(--line)',
              color: selectedCount > 0 ? '#fff' : 'var(--muted)',
            }}
          >
            {tr.find_vacancies[lang]}
          </button>
        </div>
      </div>
    </div>
  )
}
