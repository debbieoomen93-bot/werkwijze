'use client'

import { useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { translations } from '@/lib/translations'
import type { AnalysisResult } from '@/lib/types'

interface Props {
  results: AnalysisResult
}

export default function PdfExportButton({ results }: Props) {
  const { lang } = useLanguage()
  const [loading, setLoading] = useState(false)
  const tr = translations.results

  async function handleExport() {
    setLoading(true)
    try {
      const { generatePDF } = await import('@/lib/pdf')
      await generatePDF(results, lang)
    } catch (err) {
      console.error('PDF generation failed:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      className="text-sm font-semibold px-4 py-2.5 rounded-xl border transition-all min-h-[44px]"
      style={{
        borderColor: 'var(--line)',
        color: loading ? 'var(--muted)' : 'var(--ink)',
        background: 'transparent',
      }}
    >
      {loading ? tr.pdf_generating[lang] : tr.download_pdf[lang]}
    </button>
  )
}
