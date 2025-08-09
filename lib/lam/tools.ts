import { PRODUCTS, type ProductRec } from '../../data/products';

export type ToolCall = { name: string; arguments: any };
export type ToolResult = { name: string; ok: boolean; data?: any; error?: string };

export type ToolDef = {
  name: string;
  description: string;
  parameters: any; // JSON Schema
  run: (args:any) => Promise<ToolResult>;
};

async function jsonFetch(url:string, init?:RequestInit){
  const r = await fetch(url, init);
  const text = await r.text();
  try {
    const j = JSON.parse(text);
    if(!r.ok) throw new Error(typeof j?.error==='string' ? j.error : text);
    return j;
  } catch {
    if(!r.ok) throw new Error(text);
    return text;
  }
}

export const tools: ToolDef[] = [
  {
    name: 'list_products',
    description: 'List available products. Optionally filter by tier: low|mid|high.',
    parameters: {
      type: 'object',
      properties: { tier: { type: 'string', enum: ['low','mid','high'] } },
      required: []
    },
    async run(args:any){
      const tier = args?.tier as ('low'|'mid'|'high'|undefined);
      const data = tier ? PRODUCTS.filter(p=>p.tier===tier) : PRODUCTS;
      return { name:'list_products', ok: true, data };
    }
  },
  {
    name: 'create_checkout',
    description: 'Create a Square checkout payment link for a product slug.',
    parameters: {
      type: 'object',
      properties: { slug: { type: 'string', description: 'Product slug' } },
      required: ['slug']
    },
    async run(args:any){
      const slug = args?.slug as string;
      if(!slug) return { name:'create_checkout', ok:false, error:'Missing slug' };
      try{
        const base = process.env.NEXT_PUBLIC_SITE_URL || '';
        const data = await jsonFetch(`${base}/api/checkout?slug=${encodeURIComponent(slug)}`, { method:'POST' });
        return { name:'create_checkout', ok:true, data };
      }catch(e:any){
        return { name:'create_checkout', ok:false, error: e?.message || String(e) };
      }
    }
  },
  {
    name: 'health_check',
    description: 'Call /api/health and return the JSON report.',
    parameters: { type:'object', properties:{}, required:[] },
    async run(){
      try{
        const base = process.env.NEXT_PUBLIC_SITE_URL || '';
        const data = await jsonFetch(`${base}/api/health`);
        return { name:'health_check', ok:true, data };
      }catch(e:any){
        return { name:'health_check', ok:false, error: e?.message || String(e) };
      }
    }
  },
  {
    name: 'fetch_url',
    description: 'Fetch a URL (json or text) to gather data.',
    parameters: { type:'object', properties:{ url:{type:'string'} }, required:['url'] },
    async run(args:any){
      const url = args?.url; if(!url) return { name:'fetch_url', ok:false, error:'Missing url' };
      try{
        const data = await jsonFetch(url);
        return { name:'fetch_url', ok:true, data };
      }catch(e:any){
        return { name:'fetch_url', ok:false, error:e?.message||String(e) };
      }
    }
  }
];

export function openAIToolSpecs(){
  // Map our tools to OpenAI-compatible tool schema
  return tools.map(t => ({
    type: 'function',
    function: {
      name: t.name,
      description: t.description,
      parameters: t.parameters
    }
  }));
}

export async function runTool(call: ToolCall): Promise<ToolResult>{
  const t = tools.find(x=>x.name===call.name);
  if(!t) return { name: call.name, ok:false, error:'Unknown tool' };
  return t.run(call.arguments || {});
}
