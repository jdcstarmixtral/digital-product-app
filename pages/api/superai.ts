import type { NextApiRequest, NextApiResponse } from 'next';
import { groqChat } from '../../lib/groqClient';
export const dynamic = 'force-dynamic';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { messages } = (req.method === 'POST' ? req.body : { messages: [{ role:'user', content:'ping' }] }) || {};
    if (!Array.isArray(messages)) return res.status(400).json({ error: 'Invalid messages format' });

    const reply = await groqChat(messages);
    return res.status(200).json({ reply, engine: 'groq', model: process.env.CHAT_MODEL || 'llama3-70b-8192' });
  } catch (e: any) {
    return res.status(500).json({ error: 'AI route failure', details: e?.message || String(e) });
  }
}
