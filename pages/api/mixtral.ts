import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

const MIXTRAL_ENDPOINT = 'https://openrouter.ai/api/v1/chat/completions'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { messages } = req.body

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Missing or invalid messages' })
  }

  try {
    const response = await axios.post(
      MIXTRAL_ENDPOINT,
      {
        model: 'mistral/mixtral-8x7b',
        messages,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'HTTP-Referer': process.env.OPENROUTER_HTTP_REFERER || 'https://digital-product.vercel.app',
          'X-Title': process.env.OPENROUTER_X_TITLE || 'JDC LAM',
        },
      }
    )

    const reply = response.data.choices?.[0]?.message?.content || '⚠️ No reply from model'
    res.status(200).json({ reply })

  } catch (err: any) {
    console.error('[Mixtral Error]', err.response?.data || err.message)
    res.status(500).json({ error: 'Mixtral request failed' })
  }
}
