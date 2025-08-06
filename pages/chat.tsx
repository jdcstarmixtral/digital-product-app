import { useState } from "react";
import Head from "next/head";
import axios from "axios";

export default function ChatPage() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { role: "user", content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post("/api/mixtral", {
        messages: updatedMessages,
      });
      setMessages([...updatedMessages, { role: "assistant", content: response.data.output }]);
    } catch (error) {
      setMessages([...updatedMessages, { role: "assistant", content: "⚠️ Error from Mixtral API." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>SuperAI Chat - JDC System</title>
      </Head>
      <main className="p-6 bg-black text-white min-h-screen">
        <h1 className="text-3xl font-bold mb-6">🧠 SuperAI Chat</h1>
        <div className="bg-gray-800 p-4 rounded max-h-[65vh] overflow-y-auto mb-4">
          {messages.map((msg, i) => (
            <div key={i} className={}>
              <div className={}>
                {msg.content}
              </div>
            </div>
          ))}
          {loading && <div className="text-yellow-400 italic">Typing...</div>}
        </div>
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question..."
            className="flex-1 px-4 py-2 rounded bg-gray-700 text-white"
          />
          <button
            onClick={sendMessage}
            className="px-4 py-2 bg-purple-600 rounded hover:bg-purple-700"
            disabled={loading}
          >
            Send
          </button>
        </div>
      </main>
    </>
  );
}
