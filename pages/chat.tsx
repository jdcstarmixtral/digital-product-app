import Head from "next/head"
import { useState } from "react"

export default function Chat() {
  const [messages, setMessages] = useState([
    {
      role: "system",
      content: "You are Mixtral, the elite AI chat system. You are self-healing, responsive, and built for live production performance. Always respond intelligently and helpfully."
    }
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)

  const sendMessage = async () => {
    if (!input.trim()) return
    const newMessages = [...messages, { role: "user", content: input }]
    setMessages(newMessages)
    setLoading(true)

    const res = await fetch("/api/mixtral", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        memoryId: "chat-global", // static memory bucket, can be customized per user later
        input
      })
    })

    const data = await res.json()
    const reply = data.output || "⚠️ No response"
    setMessages([...newMessages, { role: "assistant", content: reply }])
    setInput("")
    setLoading(false)
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Head>
        <title>MIXTRAL AI CHAT</title>
        <meta name="description" content="Mixtral – The elite, self-healing AI chat interface." />
      </Head>
      <h1 className="text-3xl font-bold mb-4">MIXTRAL AI CHAT</h1>

      <div className="space-y-4 mb-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-lg ${msg.role === "user" ? "bg-blue-100" : msg.role === "assistant" ? "bg-green-100" : "bg-gray-100"}`}
          >
            <strong>{msg.role}:</strong> {msg.content}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Mixtral anything..."
          className="flex-1 border p-2 rounded"
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="bg-black text-white px-4 py-2 rounded"
        >
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  )
}
