import type { NextApiRequest, NextApiResponse } from 'next';
import { chat } from '@/lib/aiEngine';
export const dynamic = 'force-dynamic';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const engine = process.env.AI_ENGINE || 'groq';
  const model = process.env.CHAT_MODEL || 'llama3-70b-8192';
  const probes:any = {};
  async function probe(name: string) {
    try {
      const reply = await chat([{ role:'user', content:'ping' }]);
      probes[name] = { ok: true, status: 200, sample: String(reply).slice(0,60) };
    } catch (e:any) {
      probes[name] = { ok: false, status: 500, error: { error: 'AI route failure', details: e?.message || String(e) } };
    }
  }
  await probe('chat');   // representative
  const ok = probes.chat?.ok;
  res.status(200).json({ status: ok ? 'OK' : 'ISSUES_DETECTED', report: { engine, model, probes }});
}
