import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

export const maxDuration = 60

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

Write ALL text fields in ${language === 'nl' ? 'Dutch' : 'English'} only. Set the opposite-language fields to the same value.

Return ONLY this JSON (no markdown, no extra text):
{
  "matches": [
    {
      "title_nl": "functietitel",
      "title_en": "job title",
      "match_score": 94,
      "summary_nl": "2 sentences why this fits this person, referencing their answers",
      "summary_en": "same",
      "why_bullets_nl": ["Reden 1", "Reden 2", "Reden 3"],
      "why_bullets_en": ["same"],
      "tags_nl": ["Tag1", "Tag2", "Tag3"],
      "tags_en": ["same"],
      "salary_indication": "€3.500 – €5.500 / maand",
      "search_terms": ["term1", "term2", "term3"]
    }
  ],
  "overall_profile_nl": "2 sentence profile",
  "overall_profile_en": "same",
  "profile_tags_nl": ["Tag1", "Tag2", "Tag3"],
  "profile_tags_en": ["same"]
}

Rules: exactly 7 matches, match_score 65-97 varied, sorted descending, salary format €X.XXX – €X.XXX / maand, summaries reference specific answers.`,
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
