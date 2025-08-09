import type { NextApiRequest, NextApiResponse } from 'next'

export const dynamic = 'force-dynamic'

type Msg = { role: 'user' | 'assistant' | 'system'; content: string }

async function callOpenRouter(messages: Msg[]) {
  const key = process.env.OPENROUTER_API_KEY
  if (!key) {
    return {
      ok: false,
      status: 401,
      data: { error: { message: 'OPENROUTER_API_KEY missing' } },
    }
  }

  const referer =
    process.env.OPENROUTER_HTTP_REFERER ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    'https://jdc-lam-final.vercel.app'

  const resp = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': referer,
      'X-Title': process.env.OPENROUTER_X_TITLE || 'Mixtral Chat',
    },
    body: JSON.stringify({
      model: 'mistralai/mixtral-8x7b-instruct',
      messages,
    }),
  })

  const data = await resp.json().catch(() => ({}))
  const content =
    data?.choices?.[0]?.message?.content ??
    data?.choices?.[0]?.text ??
    ''

  return { ok: resp.ok, status: resp.status, data, content }
}

async function callHF(messages: Msg[]) {
  const token = process.env.HUGGINGFACE_API_TOKEN
  if (!token) {
    return {
      ok: false,
      status: 401,
      data: { error: { message: 'HUGGINGFACE_API_TOKEN missing' } },
    }
  }
  const prompt = messages.map(m => `${m.role}: ${m.content}`).join('\n')
  // Lightweight instruct model fallback; adjust if you have a different one allowed.
  const model = process.env.HF_MODEL || 'mistralai/Mixtral-8x7B-Instruct-v0.1'

  const resp = await fetch(`https://api-inference.huggingface.co/models/${encodeURIComponent(model)}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ inputs: prompt, parameters: { max_new_tokens: 200 } }),
  })

  const data = await resp.json().catch(() => ({}))
  let content = ''
  if (Array.isArray(data) && data[0]?.generated_text) {
    content = data[0].generated_text
  } else if (typeof data === 'string') {
    content = data
  } else if (data?.generated_text) {
    content = data.generated_text
  }

  return { ok: resp.ok, status: resp.status, data, content }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }
  const { messages } = req.body || {}
  if (!Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid messages format' })
  }

  try {
    // 1) Try OpenRouter
    const or = await callOpenRouter(messages as Msg[])
    if (or.ok && or.content) {
      return res.status(200).json({ reply: or.content })
    }

    // If OpenRouter auth issue, try HF as fallback to keep the UI alive
    if (!or.ok && (or.status === 401 || or.status === 403)) {
      const hf = await callHF(messages as Msg[])
      if (hf.ok && hf.content) {
        return res.status(200).json({ reply: hf.content, note: 'HF fallback used due to OpenRouter auth' })
      }
      return res.status(502).json({
        error: 'OpenRouter auth error and HF fallback failed',
        details: { openrouter: or.data, huggingface: hf.data },
      })
    }

    // Other OpenRouter errors (non-auth)
    if (!or.ok) {
      return res.status(502).json({ error: 'OpenRouter error', details: or.data })
    }

    // Safety net
    return res.status(500).json({ error: 'No content returned' })
  } catch (e: any) {
    return res.status(500).json({ error: 'Server error', details: e?.message || String(e) })
  }
}
