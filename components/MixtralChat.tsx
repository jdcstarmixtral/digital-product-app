import { useState } from 'react'

export default function MixtralChat() {
  const [messages, setMessages] = useState([{ role: 'assistant', content: 'Welcome to Mixtral AI. How can I help?' }])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const sendMessage = async () => {
    if (!input.trim()) return
    const newMessages = [...messages, { role: 'user', content: input }]
    setMessages(newMessages)
    setLoading(true)
    setInput('')

    try {
      const res = await fetch('/api/mixtral', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages })
      })
      const data = await res.json()
      setMessages([...newMessages, { role: 'assistant', content: data.result || 'Error: no response' }])
    } catch (err) {
      setMessages([...newMessages, { role: 'assistant', content: 'Error: failed to connect to Mixtral' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white border shadow-lg rounded-lg w-96 max-h-[70vh] overflow-y-auto p-4 z-50">
      <div className="text-lg font-bold mb-2">💬 Mixtral Chat</div>
      <div className="space-y-2 max-h-60 overflow-y-auto mb-2">
        {messages.map((msg, i) => (
          <div key={i} className={`text-sm p-2 rounded ${msg.role === 'user' ? 'bg-blue-100 text-right' : 'bg-gray-100'}`}>
            {msg.content}
          </div>
        ))}
        {loading && <div className="text-sm italic text-gray-400">Mixtral is typing...</div>}
      </div>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          className="flex-1 border px-2 py-1 rounded text-sm"
          placeholder="Type a message..."
        />
        <button onClick={sendMessage} className="bg-black text-white text-sm px-3 py-1 rounded">Send</button>
      </div>
    </div>
  )
}
