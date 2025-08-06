import Link from "next/link";
import { useState, useEffect } from "react";

export default function Dashboard() {
  const [coreLaws, setCoreLaws] = useState([]);
  const [error, setError] = useState("");
  const [showOverride, setShowOverride] = useState(false);
  const [systemStatus, setSystemStatus] = useState("🟢 All Systems Go");

  useEffect(() => {
    const fetchLaws = async () => {
      try {
        const res = await fetch("/api/corelaws");
        const data = await res.json();
        setCoreLaws(data.laws);
      } catch (err) {
        setError("⚠️ Failed to load core laws.");
        setSystemStatus("⚠️ Issues Detected");
      }
    };

    fetchLaws();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-6 font-mono">
      <h1 className="text-3xl mb-4 font-bold">🧠 JDC LAM Control Panel</h1>

      <div className="mb-4">
        <strong>System Status:</strong> <span>{systemStatus}</span>
      </div>

      <button
        onClick={() => setShowOverride(!showOverride)}
        className="px-4 py-2 bg-red-700 rounded hover:bg-red-800 transition"
      >
        {showOverride ? "Hide" : "Show"} Manual Override
      </button>

      {showOverride && (
        <div className="mt-4 border border-red-500 p-4 rounded-lg">
          <h2 className="text-xl mb-2 font-semibold text-red-300">🚨 Emergency Override Panel</h2>
          <ul className="list-disc ml-6">
            <li>Force rebuild system</li>
            <li>Trigger AI healing pipeline</li>
            <li>Flush payment cache</li>
            <li>Inject fallback content</li>
          </ul>
        </div>
      )}

      <h2 className="mt-6 text-2xl font-semibold">🔐 Core System Laws</h2>
      {error ? (
        <p className="text-red-400 mt-2">{error}</p>
      ) : (
        <ul className="mt-2 space-y-2">
          {coreLaws.map((law, i) => (
            <li key={i} className="bg-gray-800 p-3 rounded border border-gray-600">
              <strong>{law.title}:</strong> {law.description}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-6">
        <Link href="/dashboard/ai-chat" className="text-blue-400 underline mr-6">
          🤖 Launch AI Control Chat
        </Link>
        <Link href="/dashboard/image-gen" className="text-blue-400 underline">
          🎨 Open Image Generator
        </Link>
      </div>
    </div>
  );
}
