'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import type { Language } from '@/lib/types'
import { storage } from '@/lib/storage'

interface LanguageContextType {
  lang: Language
  setLang: (l: Language) => void
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'nl',
  setLang: () => {},
})

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>('nl')

  useEffect(() => {
    setLangState(storage.getLang())
  }, [])

  function setLang(l: Language) {
    setLangState(l)
    storage.setLang(l)
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
