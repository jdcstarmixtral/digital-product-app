import axios from "axios";

export async function runSelfHealingDiagnostics() {
  const report: string[] = [];

  try {
    // 🔁 Check chat API
    const chatRes = await axios.post("/api/mixtral", {
      messages: [{ role: "user", content: "ping" }]
    });
    if (!chatRes.data || !chatRes.data.choices) {
      report.push("❌ Mixtral API returned no valid choices.");
    }
  } catch (err) {
    report.push("❌ Mixtral API unreachable.");
  }

  try {
    // 🔁 Check dashboard page
    const dashboardRes = await axios.get("/dashboard");
    if (dashboardRes.status !== 200) {
      report.push("❌ Dashboard route broken.");
    }
  } catch (err) {
    report.push("❌ Dashboard route not reachable.");
  }

  try {
    // 🔁 Check core laws module
    const lawsRes = await axios.get("/api/corelaws");
    if (lawsRes.status !== 200) {
      report.push("❌ Core laws backend route failed.");
    }
  } catch (err) {
    report.push("❌ Core laws backend route unreachable.");
  }

  if (report.length === 0) {
    console.log("✅ Self-healing scan complete. All systems operational.");
    return { healthy: true };
  } else {
    console.error("⚠️ System diagnostics report:\n", report.join("\n"));
    return { healthy: false, report };
  }
}
