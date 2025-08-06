import { useState } from "react"
import Head from "next/head"

export default function AiChat() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch("/api/mixtral", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input,
          memoryId: "jdc-core-memory"
        })
      })
      const data = await res.json()
      setOutput(data.output)
    } catch (err) {
      setOutput("⚠️ Mixtral backend error.")
    }
    setLoading(false)
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Head>
        <title>JDC AI Chat</title>
      </Head>
      <h1 className="text-3xl font-bold mb-4">Mixtral Intelligence Dashboard</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <textarea
          className="w-full p-3 border rounded"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask the JDC AI anything..."
        />
        <button
          type="submit"
          className="mt-2 px-4 py-2 bg-black text-white rounded"
          disabled={loading}
        >
          {loading ? "Thinking..." : "Send"}
        </button>
      </form>
      <div className="p-4 border bg-gray-100 rounded whitespace-pre-wrap">{output}</div>
    </div>
  )
}
