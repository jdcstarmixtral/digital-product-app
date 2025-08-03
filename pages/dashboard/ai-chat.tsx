import { useState } from "react";
import Head from "next/head";

export default function MixtralAIChat() {
  const [messages, setMessages] = useState([{ role: "system", content: "You're now chatting with J-Star Mixtral AI. Ask me anything." }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    if (!input.trim()) return;
    const userMessage = { role: "user", content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/mixtral", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      const data = await res.json();
      if (data?.reply) {
        setMessages([...updatedMessages, { role: "assistant", content: data.reply }]);
      } else {
        setMessages([...updatedMessages, { role: "assistant", content: "No response from Mixtral." }]);
      }
    } catch (err) {
      setMessages([...updatedMessages, { role: "assistant", content: "Error reaching AI." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Head><title>Mixtral AI Chat</title></Head>
      <main className="p-6 max-w-3xl mx-auto min-h-screen bg-white">
        <h1 className="text-3xl font-bold mb-6">🤖 Chat with J-Star Mixtral AI</h1>
        <div className="space-y-4 mb-6">
          {messages.map((msg, i) => (
            <div key={i} className={msg.role === "user" ? "text-right" : "text-left"}>
              <div className={`inline-block px-4 py-2 rounded-xl ${msg.role === "user" ? "bg-blue-100" : "bg-gray-200"}`}>
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            className="flex-1 p-2 border rounded-lg"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Ask anything..."
          />
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg" onClick={sendMessage} disabled={loading}>
            {loading ? "..." : "Send"}
          </button>
        </div>
      </main>
    </>
  );
}
