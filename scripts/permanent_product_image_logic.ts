// ✅ Auto-AI Image Generator for Product Pages — LIVE BUILD
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';
const IMAGE_OUTPUT_PATH = path.join(process.cwd(), 'public', 'images');

/**
 * 1. Generate a product image using AI based on product title
 */
export async function generateProductImage(title: string, slug: string) {
  const prompt = `Create a high-quality e-commerce product cover for: "${title}" — white background, elite design, product-centric focus`;

  const res = await fetch("https://openrouter.ai/api/v1/images/generate", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      prompt,
      model: "midjourney", // or "dalle-3" or "stability-ai" based on your OpenRouter plan
      size: "512x512",
      n: 1
    })
  });

  const data = await res.json();
  if (!data?.data?.[0]?.url) {
    throw new Error("Image generation failed");
  }

  // Download image and save
  const imageUrl = data.data[0].url;
  const imageBuffer = await fetch(imageUrl).then(r => r.buffer());
  const imagePath = path.join(IMAGE_OUTPUT_PATH, `${slug}.jpg`);

  fs.mkdirSync(IMAGE_OUTPUT_PATH, { recursive: true });
  fs.writeFileSync(imagePath, imageBuffer);
  return `/images/${slug}.jpg`;
}

/**
 * 2. Retrieve image URL from slug (safe for frontend)
 */
export function getImageUrlForSlug(slug: string): string {
  return `/images/${slug}.jpg`;
}
