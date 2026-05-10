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
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 3000,
      system: `You are an expert career counsellor. Based on the user's answers, identify the 5 job titles that best match their personality, values, background, and interests. Be specific and reference their actual answers. Respond ONLY with valid JSON. No markdown. No explanation outside the JSON.`,
      messages: [
        {
          role: 'user',
          content: `Here are the user's questionnaire answers:

${answersText}

${langInstruction}

Return ONLY this JSON (no markdown, no extra text):
{
  "matches": [
    {
      "title_nl": "Functietitel in het Nederlands",
      "title_en": "Job title in English",
      "match_score": 94,
      "summary": "2 sentences explaining why this fits THIS specific person, referencing their actual answers",
      "why_bullets": [
        "Specific reason referencing their answer",
        "Another specific reason",
        "Third reason"
      ],
      "tags": ["Tag1", "Tag2", "Tag3"],
      "salary_indication": "€3.500 – €5.500 / maand",
      "search_terms": ["term1", "term2", "term3"]
    }
  ],
  "overall_profile": "2 sentences describing the user's work profile",
  "profile_tags": ["Tag1", "Tag2", "Tag3"]
}

Requirements:
- Exactly 5 matches
- match_score between 65-97, varied, sorted descending
- salary_indication always "€X.XXX – €X.XXX / maand"
- 3 search_terms per match
- 3 tags per match
- summary and bullets must reference SPECIFIC answers
- 3 why_bullets per match`,
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

    // Expand single-language fields to bilingual format expected by the frontend
    parsed.matches = parsed.matches.map((m: Record<string, unknown>) => ({
      ...m,
      summary_nl: m.summary,
      summary_en: m.summary,
      why_bullets_nl: m.why_bullets,
      why_bullets_en: m.why_bullets,
      tags_nl: m.tags,
      tags_en: m.tags,
    }))
    parsed.overall_profile_nl = parsed.overall_profile
    parsed.overall_profile_en = parsed.overall_profile
    parsed.profile_tags_nl = parsed.profile_tags
    parsed.profile_tags_en = parsed.profile_tags

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
