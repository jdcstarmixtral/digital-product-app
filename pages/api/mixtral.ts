import type { NextApiRequest, NextApiResponse } from 'next'

export const dynamic = 'force-dynamic'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  const { messages } = req.body
  if (!Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid messages format' })
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.OPENROUTER_HTTP_REFERER || '',
        'X-Title': process.env.OPENROUTER_X_TITLE || 'Mixtral Chat'
      },
      body: JSON.stringify({
        model: 'mistralai/mixtral-8x7b-instruct',
        messages
      })
    })

    const data = await response.json()

    if (!response.ok || !data?.choices?.[0]) {
      console.error('Mixtral API error:', data)
      return res.status(500).json({ error: 'No valid response from Mixtral', details: data })
    }

    const replyContent =
      data.choices[0].message?.content ||
      data.choices[0].text ||
      'Mixtral replied, but no readable content found.'

    return res.status(200).json({ reply: replyContent })
  } catch (err) {
    console.error('Mixtral fetch error:', err)
    return res.status(500).json({ error: 'Fetch failed', details: err })
  }
}
