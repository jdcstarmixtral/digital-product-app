import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { command, payload } = req.body;

  if (!command) {
    return res.status(400).json({ error: 'Missing command' });
  }

  try {
    const lamRes = await fetch("https://api.mixtral.ai/v1/lam/execute", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.MIXTRAL_API_KEY}`
      },
      body: JSON.stringify({
        command,
        payload,
      }),
    });

    const result = await lamRes.json();

    if (!lamRes.ok) {
      return res.status(500).json({ error: "LAM backend error", details: result });
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("LAM error:", error);
    return res.status(500).json({ error: "LAM execution failed" });
  }
}
