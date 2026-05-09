import type { Language } from './types'

export const translations = {
  nav: {
    logo: { nl: 'WerkWijzer', en: 'WerkWijzer' },
    beta: { nl: 'Beta', en: 'Beta' },
  },
  welcome: {
    badge: { nl: '🔍 Baanradar', en: '🔍 Job Radar' },
    h1: {
      nl: 'Uitzoeken wat jij wil doen. Zonder gedoe.',
      en: 'Figure out what you want to do. Without the fuss.',
    },
    subtitle: {
      nl: 'Beantwoord een paar slimme vragen over wie je bent en wat je wil. De AI analyseert je profiel en geeft je 7 functie-matches met echte vacatures.',
      en: 'Answer a few smart questions about who you are and what you want. The AI analyses your profile and gives you 7 job matches with real vacancies.',
    },
    quip: {
      nl: 'Geen "volg je passie"-praatjes hier.\nGewoon uitzoeken wat bij je past.',
      en: 'No "follow your passion" talk here.\nJust figuring out what actually fits you.',
    },
    cta: { nl: 'Begin de analyse →', en: 'Start the analysis →' },
    continue_banner: {
      nl: 'Je hebt al een analyse gedaan. Wil je verder gaan?',
      en: 'You already have an analysis. Want to continue?',
    },
    continue_btn: { nl: 'Ga verder →', en: 'Continue →' },
    restart_btn: { nl: 'Opnieuw beginnen', en: 'Start over' },
    stats: {
      questions: { nl: '~20', en: '~20' },
      questions_label: { nl: 'Slimme vragen, afgestemd op jou', en: 'Smart questions, tailored to you' },
      matches: { nl: '7', en: '7' },
      matches_label: { nl: 'Functie-matches met persoonlijke uitleg', en: 'Job matches with personal explanation' },
      vacancies: { nl: '∞', en: '∞' },
      vacancies_label: { nl: 'Vacatures in NL, BE en internationaal', en: 'Vacancies in NL, BE and internationally' },
    },
    features: {
      nl: ['Adaptieve vragen', 'AI-analyse', 'Live vacatures', 'Gratis — geen account'],
      en: ['Adaptive questions', 'AI analysis', 'Live vacancies', 'Free — no account'],
    },
  },
  wizard: {
    next: { nl: 'Volgende →', en: 'Next →' },
    skip: { nl: 'Sla over', en: 'Skip' },
    back: { nl: '← Terug', en: '← Back' },
    start_analysis: { nl: 'Start analyse ✓', en: 'Start analysis ✓' },
    personalising: { nl: 'Even aanpassen op jouw situatie...', en: 'Tailoring to your situation...' },
    question_of: { nl: 'van', en: 'of' },
    max_select: { nl: 'Kies maximaal', en: 'Choose up to' },
    options_selected: { nl: 'geselecteerd', en: 'selected' },
  },
  loading: {
    messages: {
      nl: [
        'We lezen al jouw antwoorden zorgvuldig.',
        'We matchen jouw profiel met honderden functies...',
        'We kijken verder dan de voor de hand liggende opties...',
        'Bijna klaar — laatste check...',
      ],
      en: [
        'We are carefully reading all your answers.',
        'We are matching your profile with hundreds of roles...',
        'We are looking beyond the obvious options...',
        'Almost done — final check...',
      ],
    },
    footnote: {
      nl: "Geen zorgen, we vragen niet om je LinkedIn-wachtwoord.",
      en: "Don't worry, we won't ask for your LinkedIn password.",
    },
    title: { nl: 'Jouw analyse wordt gemaakt...', en: 'Your analysis is being created...' },
  },
  results: {
    storage_banner: {
      nl: '💾 Je resultaten worden nergens opgeslagen. Sluit je dit venster, dan zijn ze weg. Download de PDF hieronder om ze te bewaren.',
      en: '💾 Your results are not saved anywhere. Close this window and they\'re gone. Download the PDF below to keep them.',
    },
    title: { nl: 'Jouw matches', en: 'Your matches' },
    subtitle: { nl: 'Gebaseerd op jouw unieke profiel', en: 'Based on your unique profile' },
    profile_title: { nl: 'Jouw werkprofiel', en: 'Your work profile' },
    match_score: { nl: 'match', en: 'match' },
    why_title: { nl: 'Waarom deze match?', en: 'Why this match?' },
    why_toggle: { nl: 'Toon uitleg', en: 'Show explanation' },
    why_hide: { nl: 'Verberg uitleg', en: 'Hide explanation' },
    select_label: { nl: 'Dit spreekt me aan', en: 'This appeals to me' },
    selected_count: { nl: 'functie(s) geselecteerd', en: 'role(s) selected' },
    find_vacancies: { nl: 'Zoek vacatures →', en: 'Find vacancies →' },
    download_pdf: { nl: '↓ Download PDF', en: '↓ Download PDF' },
    restart: { nl: 'Opnieuw beginnen', en: 'Start over' },
    salary: { nl: 'Salaris:', en: 'Salary:' },
    pdf_generating: { nl: 'PDF wordt aangemaakt...', en: 'Generating PDF...' },
    error_no_results: {
      nl: 'Geen resultaten gevonden. Ga terug en doe de analyse opnieuw.',
      en: 'No results found. Go back and redo the analysis.',
    },
  },
  vacancies: {
    title: { nl: 'Vacatures voor jou', en: 'Vacancies for you' },
    subtitle: { nl: 'Gevonden op basis van jouw matches 🇳🇱 🇧🇪 🌍', en: 'Found based on your matches 🇳🇱 🇧🇪 🌍' },
    loading: { nl: 'Vacatures worden gezocht...', en: 'Searching for vacancies...' },
    no_results_title: { nl: 'Geen directe vacatures gevonden', en: 'No direct vacancies found' },
    no_results_sub: {
      nl: 'Probeer via deze platforms te zoeken:',
      en: 'Try searching on these platforms:',
    },
    view_btn: { nl: 'Bekijk →', en: 'View →' },
    back_results: { nl: '← Terug naar matches', en: '← Back to matches' },
    restart: { nl: '↩ Opnieuw beginnen', en: '↩ Start over' },
    salary_range: { nl: 'Salaris', en: 'Salary' },
    vacancies_count: { nl: 'vacature(s)', en: 'vacancy/ies' },
    error: {
      nl: 'Er ging iets mis bij het laden van vacatures.',
      en: 'Something went wrong loading vacancies.',
    },
  },
  errors: {
    generic: {
      nl: 'Er is iets misgegaan. Probeer het opnieuw.',
      en: 'Something went wrong. Please try again.',
    },
    api: {
      nl: 'De analyse kon niet worden voltooid. Controleer je verbinding en probeer opnieuw.',
      en: 'The analysis could not be completed. Check your connection and try again.',
    },
  },
}

export type TranslationKey = keyof typeof translations

export function t(
  obj: { nl: string; en: string },
  lang: Language
): string {
  return obj[lang]
}

export function tArr(
  obj: { nl: string[]; en: string[] },
  lang: Language
): string[] {
  return obj[lang]
}
