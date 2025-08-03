import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';
const IMAGE_OUTPUT_PATH = path.join(process.cwd(), 'public', 'images');

interface ImageAPIResponse {
  data: {
    url: string;
  }[];
}

async function generateProductImage(productTitle: string, fileName: string) {
  const prompt = `Hyper-realistic digital product cover for "${productTitle}". White background, centered, elite quality.`;

  const response = await fetch('https://api.openrouter.ai/v1/images/generations', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-3-haiku-20240307',
      prompt,
      size: '512x512',
    }),
  });

  const data = await response.json() as ImageAPIResponse;

  if (!data?.data?.[0]?.url) {
    throw new Error('Image generation failed. No image URL returned.');
  }

  const imageUrl = data.data[0].url;
  const imageRes = await fetch(imageUrl);
  const buffer = await imageRes.buffer();

  if (!fs.existsSync(IMAGE_OUTPUT_PATH)) {
    fs.mkdirSync(IMAGE_OUTPUT_PATH, { recursive: true });
  }

  fs.writeFileSync(path.join(IMAGE_OUTPUT_PATH, fileName), buffer);
  console.log(`✅ Saved: ${fileName}`);
}

// Example usage
generateProductImage('Quantum Booster', 'quantum-booster.png')
  .then(() => console.log('✅ Done.'))
  .catch(err => console.error('❌ Error:', err));
