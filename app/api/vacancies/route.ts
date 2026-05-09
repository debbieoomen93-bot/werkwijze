import { NextRequest, NextResponse } from 'next/server'

const ADZUNA_APP_ID = process.env.ADZUNA_APP_ID
const ADZUNA_APP_KEY = process.env.ADZUNA_APP_KEY

interface AdzunaJob {
  title: string
  company: { display_name: string }
  location: { display_name: string }
  salary_min?: number
  salary_max?: number
  description: string
  redirect_url: string
}

interface AdzunaResponse {
  results?: AdzunaJob[]
}

type CountryCode = 'nl' | 'be' | 'gb'
type FlagEmoji = '🇳🇱' | '🇧🇪' | '🌍'

const FLAGS: Record<CountryCode, FlagEmoji> = {
  nl: '🇳🇱',
  be: '🇧🇪',
  gb: '🌍',
}

async function searchAdzuna(searchTerm: string, country: CountryCode) {
  if (!ADZUNA_APP_ID || !ADZUNA_APP_KEY) return []

  const url = new URL(`https://api.adzuna.com/v1/api/jobs/${country}/search/1`)
  url.searchParams.set('app_id', ADZUNA_APP_ID)
  url.searchParams.set('app_key', ADZUNA_APP_KEY)
  url.searchParams.set('what', searchTerm)
  url.searchParams.set('results_per_page', '5')
  url.searchParams.set('content-type', 'application/json')

  try {
    const res = await fetch(url.toString(), {
      next: { revalidate: 3600 },
    })
    if (!res.ok) return []
    const data: AdzunaResponse = await res.json()
    return (data.results ?? []).map((job) => ({
      title: job.title,
      company: job.company?.display_name ?? '',
      location: job.location?.display_name ?? '',
      salary_min: job.salary_min ?? null,
      salary_max: job.salary_max ?? null,
      description_snippet: job.description?.slice(0, 150) ?? '',
      url: job.redirect_url,
      country_code: country,
      flag: FLAGS[country],
    }))
  } catch {
    return []
  }
}

export async function POST(req: NextRequest) {
  try {
    const { titles } = await req.json() as {
      titles: { title: string; search_terms: string[] }[]
    }

    const groups = await Promise.all(
      titles.map(async ({ title, search_terms }) => {
        const primaryTerm = search_terms[0] ?? title

        const [nlResults, beResults, gbResults] = await Promise.all([
          searchAdzuna(primaryTerm, 'nl'),
          searchAdzuna(primaryTerm, 'be'),
          searchAdzuna(primaryTerm, 'gb'),
        ])

        const allVacancies = [...nlResults, ...beResults, ...gbResults]

        const fallback_links =
          allVacancies.length === 0
            ? {
                indeed: `https://www.indeed.nl/jobs?q=${encodeURIComponent(title)}`,
                linkedin: `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(title)}`,
                werkzoeken: `https://werkzoeken.nl/vacatures/${encodeURIComponent(title)}`,
              }
            : undefined

        return {
          job_title: title,
          search_terms,
          vacancies: allVacancies,
          fallback_links,
        }
      })
    )

    return NextResponse.json({ groups })
  } catch (err) {
    console.error('vacancies error:', err)
    return NextResponse.json({ groups: [] }, { status: 500 })
  }
}
