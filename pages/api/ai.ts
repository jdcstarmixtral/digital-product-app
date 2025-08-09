import type { NextApiRequest, NextApiResponse } from 'next';
import { chat } from '@/lib/aiEngine';
export const dynamic = 'force-dynamic';
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });
  const { messages, engine, model } = req.body || {};
  if (!Array.isArray(messages)) return res.status(400).json({ error: 'Invalid messages format' });
  try {
    const reply = await chat(messages, { engine, model });
    res.status(200).json({ reply });
  } catch(e:any) {
    res.status(500).json({ error: 'AI route failure', details: e?.message || String(e) });
  }
}
