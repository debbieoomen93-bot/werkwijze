import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest) {
  try {
    const { answers, language } = await req.json()

    const answersText = Object.entries(answers)
      .map(([key, value]) => {
        const v = Array.isArray(value) ? value.join(', ') : String(value ?? '')
        return `${key}: ${v}`
      })
      .join('\n')

    const langInstruction =
      language === 'nl'
        ? 'Write all summaries, bullets, tags, and profile text in Dutch.'
        : 'Write all summaries, bullets, tags, and profile text in English.'

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 8096,
      system: `You are an expert career counsellor with 20 years experience helping people find their ideal career. Based on the user's answers, identify the 7 job titles that best match their personality, values, background, experience, and interests.

Be thoughtful and specific. Consider both obvious and surprising matches. Include Dutch job market relevant titles. Reference specific things from their answers in each summary to make it feel personal, not generic.

Respond ONLY with valid JSON. No markdown. No explanation outside the JSON.`,
      messages: [
        {
          role: 'user',
          content: `Here are the user's questionnaire answers:

${answersText}

Language for response: ${language}
${langInstruction}

IMPORTANT: Both _nl and _en fields are required in the JSON. Even if the language is "nl", still fill in the _en fields in English. Even if language is "en", fill in the _nl fields in Dutch.

Return ONLY this JSON structure (no markdown, no extra text):
{
  "matches": [
    {
      "title_nl": "Job title in Dutch",
      "title_en": "Job title in English",
      "match_score": 94,
      "summary_nl": "2-3 sentences in Dutch explaining why this fits THIS specific person, referencing their actual answers",
      "summary_en": "Same 2-3 sentences in English",
      "why_bullets_nl": [
        "Jij gaf aan dat je energie krijgt van...",
        "Je voorkeur voor...",
        "Jouw achtergrond in..."
      ],
      "why_bullets_en": [
        "You mentioned getting energy from...",
        "Your preference for...",
        "Your background in..."
      ],
      "tags_nl": ["Creatief", "Onderzoek", "Tech"],
      "tags_en": ["Creative", "Research", "Tech"],
      "salary_indication": "€3.500 – €5.500 / maand",
      "search_terms": ["job title", "alternative title", "related role"]
    }
  ],
  "overall_profile_nl": "Short paragraph describing the user's work profile in Dutch",
  "overall_profile_en": "Short paragraph describing the user's work profile in English",
  "profile_tags_nl": ["Empathisch", "Analytisch", "Creatief denker"],
  "profile_tags_en": ["Empathetic", "Analytical", "Creative thinker"]
}

Requirements:
- Exactly 7 matches
- match_score between 65-97, varied (not all high)
- Sorted by match_score descending
- salary_indication always in format "€X.XXX – €X.XXX / maand"
- 3-5 search_terms per match (mix of Dutch and English)
- 3-5 tags per match
- summaries must reference SPECIFIC answers, not be generic
- 3 why_bullets per match minimum`,
        },
      ],
    })

    const text = message.content[0].type === 'text' ? message.content[0].text : ''
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('No JSON found in Claude response')
    }
    const parsed = JSON.parse(jsonMatch[0])

    if (!parsed.matches || !Array.isArray(parsed.matches)) {
      throw new Error('Invalid response structure')
    }

    return NextResponse.json(parsed)
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('analyse error:', message)
    return NextResponse.json(
      { error: 'Analysis failed', detail: message },
      { status: 500 }
    )
  }
}
