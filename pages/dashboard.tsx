import { useState } from 'react'
import axios from 'axios'

export default function Dashboard() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [memoryId, setMemoryId] = useState('admin-core')

  const handleSubmit = async () => {
    setOutput('Thinking...')
    try {
      const res = await axios.post('/api/mixtral-lam', {
        input,
        memoryId,
        context: 'dashboard-command'
      })
      setOutput(res.data.output)
    } catch (err) {
      setOutput('Error: ' + err.message)
    }
  }

  return (
    <div className="min-h-screen p-6 bg-black text-white font-mono">
      <h1 className="text-2xl mb-4">🧠 Mixtral LAM Dashboard</h1>

      <input
        className="w-full p-2 mb-3 bg-zinc-800 text-white rounded"
        placeholder="Enter command to LAM"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
      >
        Execute
      </button>

      <div className="mt-6 p-4 bg-zinc-900 rounded border border-zinc-700">
        <strong>Response:</strong>
        <pre className="whitespace-pre-wrap mt-2">{output}</pre>
      </div>
    </div>
  )
}
