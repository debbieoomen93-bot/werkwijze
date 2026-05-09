export type Language = 'nl' | 'en'

export type QuestionType =
  | 'single_select'
  | 'multi_select'
  | 'open_text'
  | 'slider'
  | 'chip_select'

export interface QuestionOption {
  value: string
  label_nl: string
  label_en: string
  emoji?: string
}

export interface Question {
  id: string
  block: string
  emoji?: string
  question_nl: string
  question_en: string
  type: QuestionType
  options?: QuestionOption[]
  options_nl?: string[]
  options_en?: string[]
  skippable?: boolean
  placeholder_nl?: string
  placeholder_en?: string
  hint_nl?: string
  hint_en?: string
  max_select?: number
  min_label_nl?: string
  min_label_en?: string
  max_label_nl?: string
  max_label_en?: string
}

export interface JobMatch {
  title_nl: string
  title_en: string
  match_score: number
  summary_nl: string
  summary_en: string
  why_bullets_nl: string[]
  why_bullets_en: string[]
  tags_nl: string[]
  tags_en: string[]
  salary_indication: string
  search_terms: string[]
}

export interface AnalysisResult {
  matches: JobMatch[]
  overall_profile_nl: string
  overall_profile_en: string
  profile_tags_nl: string[]
  profile_tags_en: string[]
}

export interface Vacancy {
  title: string
  company: string
  location: string
  salary_min: number | null
  salary_max: number | null
  description_snippet: string
  url: string
  country_code: 'nl' | 'be' | 'gb'
  flag: '🇳🇱' | '🇧🇪' | '🌍'
}

export interface VacancyGroup {
  job_title: string
  search_terms: string[]
  vacancies: Vacancy[]
  fallback_links?: {
    indeed: string
    linkedin: string
    werkzoeken: string
  }
}

export interface WizardAnswers {
  [key: string]: string | string[] | number | null
}

export type BlockColor = 'rose' | 'peach' | 'sky' | 'sage'

export interface Block {
  id: string
  name_nl: string
  name_en: string
  color: BlockColor
  questions: Question[]
}
