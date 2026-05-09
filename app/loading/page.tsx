'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { storage } from '@/lib/storage'
import LoadingScreen from '@/components/LoadingScreen'

export default function LoadingPage() {
  const router = useRouter()
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    const answers = storage.getAnswers()
    const language = storage.getLang()

    async function runAnalysis() {
      try {
        const res = await fetch('/api/analyse', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ answers, language }),
          signal: controller.signal,
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.detail || `API error ${res.status}`)
        if (!data.matches) throw new Error('Invalid response format')
        storage.setResults(data)
        router.push('/results')
      } catch (err) {
        if ((err as Error).name === 'AbortError') return
        const msg = err instanceof Error ? err.message : String(err)
        console.error('Analysis failed:', msg)
        setErrorMsg(msg)
      }
    }

    runAnalysis()
    return () => controller.abort()
  }, [router])

  if (errorMsg) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div
          className="w-full max-w-[440px] rounded-2xl p-8 text-center"
          style={{ background: 'var(--card)', boxShadow: '0 4px 32px rgba(30,26,46,0.12)' }}
        >
          <p className="text-3xl mb-4">⚠️</p>
          <p className="font-semibold mb-2" style={{ color: 'var(--ink)' }}>
            Analyse mislukt
          </p>
          <p className="text-sm mb-6 font-mono break-all" style={{ color: 'var(--rose)' }}>
            {errorMsg}
          </p>
          <button
            onClick={() => router.push('/wizard')}
            className="text-sm font-semibold px-5 py-2.5 rounded-xl"
            style={{ background: 'var(--rose)', color: '#fff' }}
          >
            Terug naar vragen
          </button>
        </div>
      </div>
    )
  }

  return <LoadingScreen />
}
