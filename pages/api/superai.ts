import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { messages } = req.body
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Missing or invalid messages' })
  }

  try {
    const mixtralRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer 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',
        'HTTP-Referer': 'https://jdcstar.com',
        'X-Title': 'JDC Super AI'
      },
      body: JSON.stringify({
        model: 'mistralai/mixtral-8x7b-instruct',
        messages,
      }),
    })

    const data = await mixtralRes.json()
    const reply = data?.choices?.[0]?.message?.content || 'No response from Mixtral.'
    res.status(200).json({ reply })
  } catch (error: any) {
    res.status(500).json({ error: 'Mixtral error', detail: error.message })
  }
}
