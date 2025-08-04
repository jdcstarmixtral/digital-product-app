import type { NextApiRequest, NextApiResponse } from 'next';
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: 'Missing prompt' });

  let data;
  try {
    const response = await fetch(
      'https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ inputs:  })
      }
    );
    data = await response.json();
    if (!response.ok) return res.status(500).json({ error: data.error || 'Model failed', details: data });
  } catch (err) {
    return res.status(500).json({ error: 'Fetch failed', detail: err.message });
  }
  const text = Array.isArray(data) && data[0]?.generated_text
    ? data[0].generated_text
    : data.generated_text || JSON.stringify(data);
  res.json({ response: text });
}
