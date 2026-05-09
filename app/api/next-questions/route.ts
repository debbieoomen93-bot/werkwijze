import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest) {
  try {
    const { situation, answers_so_far, language } = await req.json()

    const situationContext = {
      studerend: 'The user is still studying or just finished their education.',
      werkend_groei: 'The user is currently working and wants to grow in their career.',
      werkend_switch: 'The user is currently working but wants to switch to something different.',
      niet_werkend: 'The user is not working and is looking for a fresh start.',
      nooit_gewerkt: 'The user has never worked for pay before.',
    }[situation as string] ?? 'The user is exploring career options.'

    const answersText = JSON.stringify(answers_so_far, null, 2)
    const langNote = language === 'nl' ? 'All question text must be in Dutch.' : 'All question text must be in English.'

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2048,
      system: `You are a career counsellor generating personalised follow-up questions for a career discovery tool. Based on the user's situation, generate 5-7 relevant questions about their work background and experience. Be warm but direct. Return ONLY valid JSON, no markdown, no explanation outside the JSON.`,
      messages: [
        {
          role: 'user',
          content: `User situation: ${situationContext}

User's answers so far:
${answersText}

Language: ${language}
${langNote}

Generate 5-7 personalised questions about work background and experience for this user.

Rules by situation:
- studerend: ask about internships, side jobs, school projects, hobby projects, clubs organised
- werkend_groei: ask about current role, what's going well, what they want more of, growth ambitions
- werkend_switch: MUST include at least one open_text question asking what is NOT working in current job. Ask about current role, what they want to keep, what triggered the switch desire, if they have a direction in mind
- niet_werkend: ask about previous work/study, how long not working, what gave energy before, what's holding them back
- nooit_gewerkt: ask about typical day, volunteer work, observing others in their jobs

Return ONLY this JSON structure (no markdown, no extra text):
{
  "questions": [
    {
      "id": "B1",
      "emoji": "💼",
      "question_nl": "Dutch question text",
      "question_en": "English question text",
      "type": "open_text",
      "options_nl": null,
      "options_en": null,
      "skippable": false,
      "placeholder_nl": "Dutch placeholder or null",
      "placeholder_en": "English placeholder or null"
    }
  ]
}

Valid types: "open_text", "single_select", "multi_select"
For single_select and multi_select: provide arrays in options_nl and options_en (same length, corresponding items)
For open_text: set options_nl and options_en to null`,
        },
      ],
    })

    const text = message.content[0].type === 'text' ? message.content[0].text : ''
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('No JSON found in response')
    }
    const parsed = JSON.parse(jsonMatch[0])
    return NextResponse.json(parsed)
  } catch (err) {
    console.error('next-questions error:', err)
    return NextResponse.json(
      { questions: [] },
      { status: 200 }
    )
  }
}
