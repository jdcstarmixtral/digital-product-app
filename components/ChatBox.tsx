import React, { useState } from 'react';

type ChatRole = 'user' | 'assistant';

interface ChatMsg {
  role: ChatRole;
  content: string;
}

export default function ChatBox() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function sendMessage(e?: React.FormEvent) {
    e?.preventDefault();
    setErr(null);
    const trimmed = input.trim();
    if (!trimmed) return;

    // lock the literal type so TS doesn't widen to string
    const userMsg: ChatMsg = { role: 'user', content: trimmed };
    const nextMsgs: ChatMsg[] = [...messages, userMsg];
    setMessages(nextMsgs);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextMsgs }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErr(
          data?.error
            ? (typeof data.error === 'string'
                ? data.error
                : data.error.message || 'Mixtral API error')
            : 'Mixtral failed'
        );
        // Show the raw details for debugging if present
        if (data?.details) {
          setMessages(m => [
            ...m,
            { role: 'assistant', content: `⚠️ ${JSON.stringify(data.details).slice(0, 1000)}` },
          ]);
        }
        return;
      }

      const reply: string =
        data?.reply ??
        data?.choices?.[0]?.message?.content ??
        data?.choices?.[0]?.text ??
        '';

      setMessages(m => [...m, { role: 'assistant', content: reply || '(no content)' }]);
    } catch (e: any) {
      setErr(e?.message || 'Network/Fetch error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="border rounded p-3 h-96 overflow-y-auto mb-3 bg-white shadow">
        {messages.length === 0 && (
          <div className="text-sm text-gray-500">Say hi to Mixtral to start…</div>
        )}
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={
              'mb-2 ' + (msg.role === 'user' ? 'text-gray-900' : 'text-blue-700')
            }
          >
            <strong>{msg.role}:</strong> {msg.content}
          </div>
        ))}
        {loading && <div className="text-xs text-gray-500">Mixtral is thinking…</div>}
        {err && (
          <div className="mt-2 text-xs text-red-600">
            Error: {err}
          </div>
        )}
      </div>

      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          className="flex-1 border rounded p-2"
          placeholder="Type your message…"
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={loading}
        />
        <button
          type="submit"
          onClick={sendMessage}
          disabled={loading}
          className="border rounded px-4 py-2"
        >
          {loading ? '…' : 'Send'}
        </button>
      </form>
    </div>
  );
}
