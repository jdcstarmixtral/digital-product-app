import Head from "next/head";
import { useState } from "react";

export default function Chat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "system",
      content:
        "You are Mixtral, the elite AI chat system. You are self-healing, responsive, and built for live production performance. Always respond intelligently and helpfully."
    }
  ]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const updatedMessages = [...messages, { role: "user", content: input }];
    setMessages(updatedMessages);
    setInput("");

    try {
      const res = await fetch("/api/mixtral", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ messages: updatedMessages })
      });

      const data = await res.json();

      if (data.choices && data.choices[0]?.message) {
        setMessages([...updatedMessages, data.choices[0].message]);
      } else {
        setMessages([
          ...updatedMessages,
          { role: "assistant", content: "Error: Invalid AI response." }
        ]);
      }
    } catch (error) {
      console.error("Error calling Mixtral API:", error);
      setMessages([
        ...updatedMessages,
        { role: "assistant", content: "Error communicating with Mixtral backend." }
      ]);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Head>
        <title>MIXTRAL AI CHAT</title>
        <meta name="description" content="Mixtral – The elite, self-healing AI chat interface." />
      </Head>
      <h1 className="text-3xl font-bold mb-4">MIXTRAL AI CHAT</h1>

      <div className="space-y-4 mb-4">
        {messages.map((msg, index) => (
          <div key={index} className={\`p-2 rounded \${msg.role === "user" ? "bg-blue-100" : "bg-gray-200"}\`}>
            <strong>{msg.role}:</strong> {msg.content}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          className="border p-2 flex-grow rounded"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
