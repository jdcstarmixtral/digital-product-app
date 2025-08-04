import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const prompt = req.body?.prompt;
  if (!prompt) {
    return res.status(400).json({ error: 'Missing prompt' });
  }

  try {
    const hfResponse = await fetch("https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        inputs: `<s>[INST] ${prompt} [/INST]`
      })
    });

    const data = await hfResponse.json();
    const output = data?.[0]?.generated_text || data;
    res.status(200).json({ output });

  } catch (error) {
    res.status(500).json({ error: 'Error reaching Mixtral model', detail: error });
  }
}
