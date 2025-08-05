import Head from "next/head";
import { useState } from "react";

export default function Chat() {
  const [messages, setMessages] = useState([
    {
      role: "system",
      content:
        "You are Mixtral, the elite AI chat system. You are self-healing, responsive, and built for live production performance. Always respond intelligently and helpfully."
    }
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setLoading(true);
    setInput("");

    try {
      const res = await fetch("/api/mixtral", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          memoryId: "mixtral-chat-session",
          input
        })
      });

      const data = await res.json();
      const aiResponse = data.output || "[Mixtral returned no response]";

      setMessages([...newMessages, { role: "assistant", content: aiResponse }]);
    } catch (err) {
      setMessages([...newMessages, { role: "assistant", content: "[Error fetching response]" }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Head>
        <title>MIXTRAL AI CHAT</title>
        <meta name="description" content="Mixtral – The elite, self-healing AI chat interface." />
      </Head>
      <h1 className="text-3xl font-bold mb-4">MIXTRAL AI CHAT</h1>
      <div className="bg-white p-4 rounded shadow max-h-[400px] overflow-y-auto mb-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`mb-2 ${msg.role === "user" ? "text-right" : "text-left"}`}>
            <span className="block whitespace-pre-wrap">{msg.content}</span>
          </div>
        ))}
        {loading && <div className="text-gray-500">Mixtral is typing...</div>}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          className="flex-grow border rounded px-3 py-2"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          Send
        </button>
      </div>
    </div>
  );
}
