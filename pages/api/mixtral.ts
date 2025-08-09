import type { NextApiRequest, NextApiResponse } from 'next';

export const dynamic = 'force-dynamic';

type Msg = { role: 'user' | 'assistant' | 'system'; content: string };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const { messages } = req.body ?? {};
  if (!Array.isArray(messages)) return res.status(400).json({ error: 'Invalid messages format' });

  const key = process.env.OPENROUTER_API_KEY;
  const referer = process.env.OPENROUTER_HTTP_REFERER || '';
  const title = process.env.OPENROUTER_X_TITLE || 'Mixtral Chat';

  if (!key) {
    return res.status(500).json({ error: 'OPENROUTER_API_KEY missing on server' });
  }

  try {
    const r = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': referer,
        'X-Title': title,
      },
      body: JSON.stringify({
        model: 'mistralai/mixtral-8x7b-instruct',
        messages: messages as Msg[],
      }),
    });

    const data = await r.json().catch(() => ({}));
    if (!r.ok) {
      // Surface exact OpenRouter error
      return res.status(r.status).json({
        error: `OpenRouter error (${r.status})`,
        details: data,
        hint: r.status === 401 ? 'Check key and Project allowlist (domain) on OpenRouter.' : undefined,
      });
    }

    const reply =
      data?.choices?.[0]?.message?.content ??
      data?.choices?.[0]?.text ?? '';

    if (!reply) {
      return res.status(502).json({ error: 'No reply content from model', details: data });
    }

    return res.status(200).json({ reply });
  } catch (err: any) {
    return res.status(500).json({ error: 'Fetch failed', details: String(err?.message || err) });
  }
}
