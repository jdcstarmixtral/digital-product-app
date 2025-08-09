import type { NextApiRequest, NextApiResponse } from 'next';

export const dynamic = 'force-dynamic';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const { messages } = req.body || {};
  if (!Array.isArray(messages)) return res.status(400).json({ error: 'Invalid messages format' });

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'Missing GROQ_API_KEY' });

  const model = process.env.CHAT_MODEL || 'llama3-70b-8192';

  try {
    const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.4,
        stream: false
      }),
    });

    const data = await r.json();

    if (!r.ok) {
      // Surface upstream error cleanly
      return res.status(r.status).json({
        error: 'Upstream error',
        details: data
      });
    }

    const reply =
      data?.choices?.[0]?.message?.content ??
      data?.choices?.[0]?.text ?? '';

    return res.status(200).json({ reply, model });
  } catch (e: any) {
    return res.status(500).json({ error: 'Fetch failed', details: e?.message || String(e) });
  }
}
