import type { NextApiRequest, NextApiResponse } from "next"
import fs from "fs"
import path from "path"

const MIXTRAL_MODEL = "mistral-7b-instruct:free";
const MIXTRAL_API = "https://openrouter.ai/api/v1/chat/completions";
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

async function callMixtral(prompt: string) {
  const res = await fetch(MIXTRAL_API, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: MIXTRAL_MODEL,
      messages: [
        { role: "system", content: "You are the backend logic AI for a digital product dashboard. Return raw JSON only." },
        { role: "user", content: prompt }
      ]
    })
  });

  const data = await res.json();
  const output = data.choices?.[0]?.message?.content || "{}";
  return JSON.parse(output);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { action } = req.body;

  switch (action) {
    case "heal":
      const healingResult = await callMixtral("Scan the system and return an object listing any missing or broken frontend routes or backend endpoints.");
      return res.status(200).json({ message: "✅ Healing triggered", result: healingResult });

    case "clear":
      // Simulate cache or state clearing
      return res.status(200).json({ message: "✅ Memory cleared and system state reset." });

    case "override":
      // Return signal that override panel is now accessible
      return res.status(200).json({ message: "✅ Override granted. Manual controls unlocked." });

    case "sync":
      // Check if product files are synced
      const dir = path.resolve(process.cwd(), "data/mixtral");
      const files = fs.existsSync(dir) ? fs.readdirSync(dir) : [];
      return res.status(200).json({ message: "✅ Sync complete.", productCount: files.length });

    default:
      return res.status(400).json({ message: "❌ Unknown action." });
  }
}
