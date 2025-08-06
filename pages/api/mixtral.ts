import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Missing or invalid messages" });
  }

  try {
    const response = await axios.post("https://mixtral.jdcapi.com/api/chat", {
      model: "mixtral-lam",
      messages,
    });

    const mixtralReply = response.data;

    return res.status(200).json(mixtralReply);
  } catch (err) {
    console.error("Mixtral API error:", err.response?.data || err.message);
    return res.status(500).json({ error: "Mixtral LAM backend failure." });
  }
}
