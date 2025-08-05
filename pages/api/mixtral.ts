import type { NextApiRequest, NextApiResponse } from "next"
import axios from "axios"

const MIXTRAL_ENDPOINT = "https://api.openrouter.ai/v1/chat/completions"
const MIXTRAL_MODEL = "mistralai/mixtral-8x7b-32768"
const MIXTRAL_KEY = process.env.OPENROUTER_API_KEY
const MIXTRAL_REFERER = process.env.OPENROUTER_HTTP_REFERER || "https://jdcai.vercel.app"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests allowed" })
  }

  const { input, memoryId } = req.body

  if (!input || !memoryId) {
    return res.status(400).json({ error: "Missing input or memoryId" })
  }

  try {
    const messages = [
      {
        role: "system",
        content:
          "You are Mixtral, a powerful, elite-level AI connected to JDC. You are self-healing, fully integrated with the user's business logic, and have persistent adaptive memory. Respond with elite, useful, and strategic responses in natural language."
      },
      { role: "user", content: input }
    ]

    const response = await axios.post(
      MIXTRAL_ENDPOINT,
      {
        model: MIXTRAL_MODEL,
        messages,
        temperature: 0.7,
        max_tokens: 1000
      },
      {
        headers: {
          Authorization: `Bearer ${MIXTRAL_KEY}`,
          "HTTP-Referer": MIXTRAL_REFERER,
          "X-Title": "JDC Mixtral Chat",
          "Content-Type": "application/json"
        }
      }
    )

    const output = response.data.choices?.[0]?.message?.content || "⚠️ Empty response from Mixtral."
    return res.status(200).json({ output })
  } catch (err: any) {
    console.error("Mixtral error:", err.response?.data || err.message)
    return res.status(500).json({ error: "Mixtral API request failed." })
  }
}
