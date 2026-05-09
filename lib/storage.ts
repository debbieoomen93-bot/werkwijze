import type { AnalysisResult, Language, VacancyGroup, WizardAnswers } from './types'

const KEYS = {
  lang: 'ww_lang',
  answers: 'ww_answers',
  results: 'ww_results',
  selected: 'ww_selected',
  vacancies: 'ww_vacancies',
} as const

function isBrowser() {
  return typeof window !== 'undefined'
}

export const storage = {
  getLang(): Language {
    if (!isBrowser()) return 'nl'
    return (localStorage.getItem(KEYS.lang) as Language) || 'nl'
  },
  setLang(lang: Language) {
    if (!isBrowser()) return
    localStorage.setItem(KEYS.lang, lang)
  },

  getAnswers(): WizardAnswers {
    if (!isBrowser()) return {}
    try {
      return JSON.parse(localStorage.getItem(KEYS.answers) || '{}')
    } catch {
      return {}
    }
  },
  setAnswers(answers: WizardAnswers) {
    if (!isBrowser()) return
    localStorage.setItem(KEYS.answers, JSON.stringify(answers))
  },

  getResults(): AnalysisResult | null {
    if (!isBrowser()) return null
    try {
      const raw = localStorage.getItem(KEYS.results)
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  },
  setResults(results: AnalysisResult) {
    if (!isBrowser()) return
    localStorage.setItem(KEYS.results, JSON.stringify(results))
  },

  getSelected(): string[] {
    if (!isBrowser()) return []
    try {
      return JSON.parse(localStorage.getItem(KEYS.selected) || '[]')
    } catch {
      return []
    }
  },
  setSelected(titles: string[]) {
    if (!isBrowser()) return
    localStorage.setItem(KEYS.selected, JSON.stringify(titles))
  },

  getVacancies(): VacancyGroup[] {
    if (!isBrowser()) return []
    try {
      return JSON.parse(localStorage.getItem(KEYS.vacancies) || '[]')
    } catch {
      return []
    }
  },
  setVacancies(vacancies: VacancyGroup[]) {
    if (!isBrowser()) return
    localStorage.setItem(KEYS.vacancies, JSON.stringify(vacancies))
  },

  clearAll() {
    if (!isBrowser()) return
    Object.values(KEYS).forEach((key) => localStorage.removeItem(key))
  },

  hasResults(): boolean {
    if (!isBrowser()) return false
    return !!localStorage.getItem(KEYS.results)
  },
}
