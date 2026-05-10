'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { storage } from '@/lib/storage'

export default function DevTestPage() {
  const router = useRouter()

  useEffect(() => {
    storage.clearAll()
    storage.setLang('nl')
    storage.setAnswers({
      A1: '25_34',
      A2: 'hbo',
      A3: 'werkend_switch',
      A4: 'Communicatie en marketing',
      C1: '3',
      C2: ['problemen', 'creatief', 'data', 'leren', 'impact'],
      C3: ['herhaling', 'admin', 'geen_feedback'],
      C4: 'bedenker',
      C5: 'beetje_druk',
      C6: 'afwegen',
      D1: ['vrijheid', 'groei', 'zinvol', 'leren'],
      D2: '2',
      D3: 'Als ik zie dat iets wat ik maak echt helpt en mensen er blij van worden.',
      D4: ['doen', 'experimenteren'],
      D5: 'mix',
      E1: '3800_5000',
      E2: ['vast', 'fulltime'],
      E3: 'hybrid',
      E4: ['geen'],
      E5: '1_3_mnd',
      F1: 'Ik podcast over true crime en kook graag Aziatisch.',
      F2: ['tech', 'creatief', 'duurzaamheid'],
      F3: 'Onderzoek naar menselijk gedrag en daar producten omheen bouwen.',
      G1: 'Vrienden vragen me om hulp bij teksten en communicatieproblemen.',
      G2: 'Analytisch denken en creatief schrijven combineren.',
      G3: 'Ik wil werk dat me uitdaagt om te denken en te maken, met ruimte om mee te sturen.',
    })
    router.push('/loading')
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p style={{ color: 'var(--muted)' }}>Laden...</p>
    </div>
  )
}
