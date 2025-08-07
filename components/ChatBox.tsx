import React, { useState } from "react";

const ChatBox = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [healingLog, setHealingLog] = useState<string[]>([]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/mixtral", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      });

      const data = await res.json();
      if (!res.ok || !data.result) throw new Error(data.error || "No response");

      setMessages((prev) => [...prev, { role: "assistant", content: data.result }]);
    } catch (err: any) {
      setError("Error: " + (err.message || "Unknown"));
    } finally {
      setLoading(false);
    }
  };

  const triggerHealing = async () => {
    setHealingLog(["🛠 Healing process initiated..."]);
    try {
      const res = await fetch("/api/heal", { method: "POST" });
      const data = await res.json();

      if (data.success && Array.isArray(data.log)) {
        setHealingLog((prev) => [...prev, ...data.log]);
      } else {
        setHealingLog((prev) => [...prev, "⚠️ Healing completed with no log output"]);
      }
    } catch (err: any) {
      setHealingLog((prev) => [...prev, "❌ Healing error: " + err.message]);
    }
  };

  return (
    <div className="p-4 bg-gray-100 rounded shadow max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">🧠 Mixtral Chat</h2>

      <div className="border rounded p-3 h-96 overflow-y-auto mb-2 bg-white shadow">
        {messages.map((msg, idx) => (
          <div key={idx} className={msg.role === "user" ? "text-right" : "text-left"}>
            <strong>{msg.role}:</strong> {msg.content}
          </div>
        ))}
        {loading && <div className="text-gray-400">⏳ Waiting for response...</div>}
        {error && <div className="text-red-500 mt-2">{error}</div>}
      </div>

      <div className="flex space-x-2">
        <input
          className="flex-1 border px-3 py-2 rounded"
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage} className="bg-blue-600 text-white px-4 py-2 rounded shadow">
          Send
        </button>
      </div>

      <div className="mt-4">
        <button onClick={triggerHealing} className="bg-green-600 text-white px-4 py-2 rounded shadow">
          🛠 Heal System
        </button>
        {healingLog.length > 0 && (
          <div className="mt-3 bg-black text-green-300 p-3 rounded max-h-64 overflow-y-auto font-mono text-sm">
            {healingLog.map((line, i) => (
              <div key={i}>{line}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatBox;
