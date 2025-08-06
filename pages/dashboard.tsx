import Head from "next/head";
import { useEffect, useState } from "react";
import { runSelfHealingDiagnostics } from "../lib/selfheal";

export default function Dashboard() {
  const [health, setHealth] = useState("Checking...");
  const [laws, setLaws] = useState([]);
  const [overrideVisible, setOverrideVisible] = useState(false);

  useEffect(() => {
    async function check() {
      const result = await runSelfHealingDiagnostics();
      setHealth(result.healthy ? "✅ All Systems Go" : "⚠️ Issues Detected");
    }

    async function fetchLaws() {
      try {
        const res = await fetch("/api/corelaws");
        const data = await res.json();
        setLaws(data || []);
      } catch (err) {
        setLaws([{ title: "Error", description: "Failed to load core laws." }]);
      }
    }

    check();
    fetchLaws();
  }, []);

  const triggerOverride = async () => {
    await fetch("/api/override", { method: "POST" });
    alert("🚨 Override triggered.");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Head>
        <title>JDC LAM Dashboard</title>
      </Head>

      <h1 className="text-4xl font-bold mb-4">JDC LAM Control Panel</h1>
      <p className="text-lg mb-2">System Status: <strong>{health}</strong></p>

      <button
        onClick={() => setOverrideVisible(!overrideVisible)}
        className="bg-black text-white px-4 py-2 rounded mb-4"
      >
        {overrideVisible ? "Hide Override" : "Show Manual Override"}
      </button>

      {overrideVisible && (
        <div className="bg-red-100 border border-red-400 p-4 mb-4 rounded">
          <p className="mb-2 text-red-800">🚨 Admin Emergency Override</p>
          <button
            onClick={triggerOverride}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Trigger Emergency Protocol
          </button>
        </div>
      )}

      <h2 className="text-2xl font-semibold mt-6 mb-2">🔐 Core System Laws</h2>
      <ul className="list-disc ml-6 space-y-2">
        {laws.map((law: any, i) => (
          <li key={i}>
            <strong>{law.title}:</strong> {law.description}
          </li>
        ))}
      </ul>
    </div>
  );
}
