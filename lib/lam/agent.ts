import { openAIToolSpecs, runTool } from './tools';

type ChatMsg = { role: 'system'|'user'|'assistant'|'tool'; content?: string; name?: string; tool_call_id?: string; };

export async function planAndAct(goal: string, maxSteps = 5){
  const apiKey = process.env.GROQ_API_KEY;
  const model = process.env.CHAT_MODEL || 'llama3-70b-8192';
  if(!apiKey) throw new Error('Missing GROQ_API_KEY');

  const tools = openAIToolSpecs();
  const messages: ChatMsg[] = [
    { role:'system', content:[
      'You are a Large Action Model (LAM).',
      'Think step-by-step. Use tools when needed. Keep steps minimal.',
      'When you are done, output a short summary and any final URLs.'
    ].join('\n') },
    { role:'user', content: goal }
  ];

  for (let step=0; step<maxSteps; step++){
    const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method:'POST',
      headers:{ 'Authorization':`Bearer ${apiKey}`, 'Content-Type':'application/json' },
      body: JSON.stringify({
        model,
        messages,
        tools,
        tool_choice: 'auto',
        temperature: 0.3
      })
    });
    const data = await r.json();
    if(!r.ok){
      return { ok:false, error:'Upstream error', details:data };
    }

    const choice = data?.choices?.[0];
    const msg = choice?.message;

    // If the model returned tool calls, execute them, push results, and loop
    const toolCalls = msg?.tool_calls || [];
    if (toolCalls.length){
      // Also push the assistant message (with tool calls)
      messages.push({ role:'assistant', content: msg?.content || '' } as any);

      for (const tc of toolCalls){
        const name = tc?.function?.name;
        let args: any = {};
        try{ args = JSON.parse(tc?.function?.arguments || '{}'); } catch{}
        const toolRes = await runTool({ name, arguments: args });
        messages.push({
          role:'tool',
          name,
          tool_call_id: tc.id,
          content: JSON.stringify(toolRes)
        });
      }
      continue; // next reasoning turn
    }

    // No tool calls => we consider it final content
    messages.push({ role:'assistant', content: msg?.content || '' });
    return { ok:true, content: msg?.content || '' };
  }

  return { ok:false, error:'Max steps reached without a final answer' };
}
