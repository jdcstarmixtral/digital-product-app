import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: 'Missing prompt' });

  try {
    const response = await fetch(
      'https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: `<s>[INST] ${prompt} [/INST]`,
        }),
      }
    );

    const data = await response.json();

    const text = Array.isArray(data) && data[0]?.generated_text
      ? data[0].generated_text
      : data.generated_text || JSON.stringify(data);

    res.status(200).json({ response: text });
  } catch (error: any) {
    res.status(500).json({ error: 'API error', detail: error.message });
  }
}
