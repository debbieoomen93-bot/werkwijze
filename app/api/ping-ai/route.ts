import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function GET() {
  const start = Date.now()
  try {
    const msg = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 10,
      messages: [{ role: 'user', content: 'Reply with just: ok' }],
    })
    const elapsed = Date.now() - start
    return NextResponse.json({ ok: true, elapsed_ms: elapsed, reply: msg.content[0] })
  } catch (err) {
    const elapsed = Date.now() - start
    return NextResponse.json({ ok: false, elapsed_ms: elapsed, error: String(err) }, { status: 500 })
  }
}
