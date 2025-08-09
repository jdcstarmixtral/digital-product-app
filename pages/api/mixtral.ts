import type { NextApiRequest, NextApiResponse } from 'next'

export const config = { api: { bodyParser: true } }
export const dynamic = 'force-dynamic'

type Msg = { role: 'system' | 'user' | 'assistant'; content: string }

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  const { messages } = req.body || {}
  if (!Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid messages format. Expect { messages: Msg[] }' })
  }

  // Pull env
  const API_KEY = process.env.OPENROUTER_API_KEY
  const REFERER = process.env.OPENROUTER_HTTP_REFERER || 'https://jdc-lam-final.vercel.app'
  const TITLE   = process.env.OPENROUTER_X_TITLE || 'Mixtral Chat'

  if (!API_KEY) {
    return res.status(500).json({ error: 'Missing OPENROUTER_API_KEY env' })
  }

  // Ensure at least one system rule (keeps model on-task)
  const wire: Msg[] = [
    { role: 'system', content: 'You are Mixtral, a concise, helpful assistant.' },
    ...(messages as Msg[])
  ]

  // Prefer instruct model first; fall back to plain if needed
  const candidates = [
    'mistralai/mixtral-8x7b-instruct',
    'mistralai/mixtral-8x7b'
  ]

  let lastErr: any = null
  for (const model of candidates) {
    try {
      const r = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
          // These two are important for OpenRouter policy:
          'HTTP-Referer': REFERER,
          'X-Title': TITLE
        },
        body: JSON.stringify({
          model,
          messages: wire,
          temperature: 0.7,
        })
      })

      const data = await r.json().catch(() => ({}))

      // Auth or account issue → bubble up with detail
      if (r.status === 401 || r.status === 403) {
        return res.status(502).json({
          error: 'Auth error from OpenRouter (401/403).',
          details: data || {},
          hint: 'Your OPENROUTER_API_KEY may be invalid OR your OpenRouter site allowlist does not include your domain.'
        })
      }

      if (!r.ok || !data?.choices?.[0]) {
        lastErr = { status: r.status, data }
        // try next candidate model
        continue
      }

      const reply =
        data.choices?.[0]?.message?.content ??
        data.choices?.[0]?.text ??
        ''

      if (!reply) {
        lastErr = { status: r.status, data }
        continue
      }

      return res.status(200).json({ reply, model })
    } catch (err: any) {
      lastErr = err?.message || String(err)
      // try next model
    }
  }

  return res.status(502).json({
    error: 'No valid response from Mixtral after trying candidates.',
    details: lastErr
  })
}
