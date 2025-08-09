import React, { useState } from 'react'

type ChatMsg = { role: 'user' | 'assistant'; content: string }

export default function ChatBox() {
  const [messages, setMessages] = useState<ChatMsg[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function sendMessage() {
    if (!input.trim()) return
    setError(null)

    const now = [...messages, { role: 'user', content: input }]
    setMessages(now)
    setInput('')
    setLoading(true)

    try {
      const r = await fetch('/api/mixtral', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: now })
      })
      const data = await r.json()
      if (!r.ok) {
        setError(
          (data?.error ? String(data.error) : 'Unknown error')
          + (data?.details ? ` | details: ${JSON.stringify(data.details).slice(0, 400)}` : '')
        )
      } else {
        setMessages([...now, { role: 'assistant', content: data.reply || '(empty reply)' }])
      }
    } catch (e: any) {
      setError(e?.message || 'Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto border rounded-xl p-4 bg-white shadow">
      <div className="h-80 overflow-y-auto space-y-2 mb-3">
        {messages.map((m, i) => (
          <div key={i} className={m.role === 'user' ? 'text-right' : 'text-left'}>
            <div className={`inline-block px-3 py-2 rounded-lg ${m.role === 'user' ? 'bg-blue-100' : 'bg-gray-100'}`}>
              <strong>{m.role}:</strong> {m.content}
            </div>
          </div>
        ))}
      </div>

      {error && (
        <div className="mb-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded p-2">
          <strong>API Error:</strong> {error}
        </div>
      )}

      <div className="flex gap-2">
        <input
          className="flex-1 border rounded px-3 py-2"
          placeholder="Say something to Mixtral…"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' ? sendMessage() : null}
        />
        <button
          className="px-4 py-2 rounded bg-black text-white disabled:opacity-50"
          onClick={sendMessage}
          disabled={loading}
        >
          {loading ? '…' : 'Send'}
        </button>
      </div>
    </div>
  )
}
