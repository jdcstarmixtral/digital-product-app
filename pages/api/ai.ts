import type { NextApiRequest, NextApiResponse } from 'next'

export const dynamic = 'force-dynamic'

type Msg = { role: 'user' | 'assistant' | 'system'; content: string }

const ENGINE = process.env.AI_ENGINE || 'groq'
const MODEL  = process.env.CHAT_MODEL || 'mixtral-8x7b-32768'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' })

  const { messages } = req.body || {}
  if (!Array.isArray(messages)) return res.status(400).json({ error: 'Invalid messages' })

  try {
    let endpoint = ''
    let headers: Record<string,string> = { 'Content-Type': 'application/json' }
    let body: any = {}

    if (ENGINE === 'groq') {
      const key = process.env.GROQ_API_KEY
      if (!key) return res.status(500).json({ error: 'Missing GROQ_API_KEY' })
      endpoint = 'https://api.groq.com/openai/v1/chat/completions'
      headers['Authorization'] = `Bearer ${key}`
      body = { model: MODEL, messages }
    } else if (ENGINE === 'together') {
      const key = process.env.TOGETHER_API_KEY
      if (!key) return res.status(500).json({ error: 'Missing TOGETHER_API_KEY' })
      endpoint = 'https://api.together.xyz/v1/chat/completions'
      headers['Authorization'] = `Bearer ${key}`
      body = { model: MODEL, messages }
    } else {
      const key = process.env.OPENROUTER_API_KEY
      if (!key) return res.status(500).json({ error: 'Missing OPENROUTER_API_KEY' })
      endpoint = 'https://openrouter.ai/api/v1/chat/completions'
      headers['Authorization'] = `Bearer ${key}`
      if (process.env.OPENROUTER_HTTP_REFERER) headers['HTTP-Referer'] = process.env.OPENROUTER_HTTP_REFERER
      if (process.env.OPENROUTER_X_TITLE)     headers['X-Title'] = process.env.OPENROUTER_X_TITLE
      body = { model: MODEL, messages }
    }

    const r = await fetch(endpoint, { method: 'POST', headers, body: JSON.stringify(body) })
    const data = await r.json().catch(() => ({} as any))

    if (!r.ok) {
      return res.status(r.status).json({ error: 'Upstream error', engine: ENGINE, details: data })
    }

    const reply =
      data?.choices?.[0]?.message?.content ??
      data?.choices?.[0]?.text ??
      ''

    return res.status(200).json({ engine: ENGINE, model: MODEL, reply })
  } catch (err: any) {
    console.error('AI route error:', err)
    return res.status(500).json({ error: 'Server error', details: err?.message || String(err) })
  }
}
