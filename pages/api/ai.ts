import type { NextApiRequest, NextApiResponse } from 'next';
import { planAndAct } from '../../lib/lam/agent';

export const dynamic = 'force-dynamic';

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  try{
    if (req.method !== 'POST') return res.status(405).json({ error:'Method Not Allowed' });
    const { goal, maxSteps } = (req.body || {});
    if (!goal || typeof goal !== 'string') return res.status(400).json({ error:'Missing goal' });
    const out = await planAndAct(goal, Math.max(1, Math.min(8, Number(maxSteps)||5)));
    if (!out.ok) return res.status(500).json(out);
    return res.status(200).json(out);
  }catch(e:any){
    return res.status(500).json({ error:'LAM failure', details:e?.message||String(e) });
  }
}
