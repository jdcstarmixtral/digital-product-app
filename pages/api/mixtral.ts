import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Missing or invalid messages" });
  }

  try {
    const response = await axios.post("http://localhost:11434/api/chat", {
      model: "mixtral",
      messages,
      stream: false
    });

    return res.status(200).json(response.data);
  } catch (error: any) {
    console.error("Mixtral API error:", error?.response?.data || error.message);
    return res.status(500).json({ error: "Mixtral backend failed" });
  }
}
