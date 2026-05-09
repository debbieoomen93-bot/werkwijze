'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/contexts/LanguageContext'
import { translations } from '@/lib/translations'
import { storage } from '@/lib/storage'
import type { JobMatch, VacancyGroup } from '@/lib/types'
import VacancyCard from '@/components/VacancyCard'

export default function VacanciesPage() {
  const { lang } = useLanguage()
  const router = useRouter()
  const tr = translations.vacancies
  const [loading, setLoading] = useState(true)
  const [vacancyGroups, setVacancyGroups] = useState<VacancyGroup[]>([])
  const [error, setError] = useState(false)

  useEffect(() => {
    const results = storage.getResults()
    const selected = storage.getSelected()

    if (!results || selected.length === 0) {
      router.push('/results')
      return
    }

    const cached = storage.getVacancies()
    if (cached && cached.length > 0) {
      setVacancyGroups(cached)
      setLoading(false)
      return
    }

    const selectedMatches = results.matches.filter((m: JobMatch) => {
      const titleKey = lang === 'nl' ? m.title_nl : m.title_en
      return selected.includes(titleKey)
    })

    const titlesPayload = selectedMatches.map((m: JobMatch) => ({
      title: lang === 'nl' ? m.title_nl : m.title_en,
      search_terms: m.search_terms,
    }))

    fetch('/api/vacancies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ titles: titlesPayload, language: lang }),
    })
      .then((r) => r.json())
      .then((data) => {
        const groups: VacancyGroup[] = data.groups || []
        storage.setVacancies(groups)
        setVacancyGroups(groups)
        setLoading(false)
      })
      .catch(() => {
        setError(true)
        setLoading(false)
      })
  }, [lang, router])

  function handleRestart() {
    storage.clearAll()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <p className="text-sm font-medium" style={{ color: 'var(--muted)' }}>
          {tr.loading[lang]}
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4">
        <p className="text-sm" style={{ color: 'var(--muted)' }}>{tr.error[lang]}</p>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-64px)] px-4 py-8">
      <div className="max-w-[740px] mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-extrabold" style={{ color: 'var(--ink)' }}>
            {tr.title[lang]}
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>
            {tr.subtitle[lang]}
          </p>
        </div>

        <div className="flex flex-col gap-8">
          {vacancyGroups.map((group) => (
            <div key={group.job_title}>
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-xl font-heading font-bold" style={{ color: 'var(--ink)' }}>
                  {group.job_title}
                </h2>
                <span
                  className="text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{ background: 'var(--rose-pale)', color: 'var(--rose)' }}
                >
                  {group.vacancies.length} {tr.vacancies_count[lang]}
                </span>
              </div>

              {group.vacancies.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {group.vacancies.map((v, i) => (
                    <VacancyCard key={i} vacancy={v} />
                  ))}
                </div>
              ) : group.fallback_links ? (
                <div
                  className="rounded-xl p-5"
                  style={{
                    border: '2px dashed var(--line)',
                    background: 'var(--card)',
                  }}
                >
                  <p className="text-sm mb-3" style={{ color: 'var(--muted)' }}>
                    {tr.no_results_sub[lang]}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <a
                      href={group.fallback_links.indeed}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium px-4 py-2 rounded-lg min-h-[40px] flex items-center"
                      style={{ background: 'var(--line)', color: 'var(--ink)' }}
                    >
                      Indeed NL
                    </a>
                    <a
                      href={group.fallback_links.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium px-4 py-2 rounded-lg min-h-[40px] flex items-center"
                      style={{ background: 'var(--line)', color: 'var(--ink)' }}
                    >
                      LinkedIn
                    </a>
                    <a
                      href={group.fallback_links.werkzoeken}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium px-4 py-2 rounded-lg min-h-[40px] flex items-center"
                      style={{ background: 'var(--line)', color: 'var(--ink)' }}
                    >
                      Werkzoeken
                    </a>
                  </div>
                </div>
              ) : (
                <p className="text-sm" style={{ color: 'var(--muted)' }}>
                  {tr.no_results_title[lang]}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-10">
          <button
            onClick={() => router.push('/results')}
            className="flex-1 text-sm font-semibold px-5 py-3 rounded-xl border min-h-[48px] transition-all"
            style={{ borderColor: 'var(--line)', color: 'var(--muted)', background: 'transparent' }}
          >
            {tr.back_results[lang]}
          </button>
          <button
            onClick={handleRestart}
            className="flex-1 text-sm font-bold px-5 py-3 rounded-xl min-h-[48px] transition-all"
            style={{ background: 'var(--rose)', color: '#fff' }}
          >
            {tr.restart[lang]}
          </button>
        </div>
      </div>
    </div>
  )
}
