cat <<'FILE' > pages/api/gen-image.ts
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt } = req.body;
  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json({ error: "Missing or invalid prompt" });
  }

  try {
    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Token r8_NHHY0KcQcP3w6A2VK4UgnLI0crvZ2hFgBPxHBgJ"
      },
      body: JSON.stringify({
        version: "db21e45fb42f4cba98284c1a202d60e4bf1e65d7be6b3cc78e68f4d75c43171d",
        input: { prompt }
      }),
    });

    const data = await response.json();

    if (data && data.output && data.output.length > 0) {
      res.status(200).json({ image: data.output[data.output.length - 1] });
    } else {
      res.status(500).json({ error: "No image returned from Replicate" });
    }
  } catch (error) {
    console.error("Image generation error:", error);
    res.status(500).json({ error: "Image generation timed out or failed" });
  }
}
FILE

git add pages/api/gen-image.ts
git commit -m "⚡ Mixtral image generation API with fallback + Replicate key"
git push
vercel deploy --prod
