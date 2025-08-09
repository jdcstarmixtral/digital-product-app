import fs from 'fs';
import path from 'path';

export type AutoConfig = {
  mode: 'live'|'static';
  tiers: { low: number; mid: number; high: number };
  minDiversity: boolean;
  image: { strategy: 'generate-or-curate'; allowStock: boolean };
  funnel: { upsell: boolean; downsell: boolean; guaranteeCopy: string };
  replaceOnUnderperform: { ctrBelow: number; crBelow: number };
};

export function loadAutoConfig(): AutoConfig {
  const p = path.join(process.cwd(), 'config', 'auto_research.config.json');
  const raw = fs.readFileSync(p, 'utf8');
  return JSON.parse(raw) as AutoConfig;
}
