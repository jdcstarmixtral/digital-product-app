// 🛠️ Permanent Fixes for Product Image Auto-Generation

import fs from 'fs';
import path from 'path';

/**
 * 1. Auto-generate the product image at creation.
 *    Replace createImageFromTitle() with your actual AI or static generator logic.
 */
async function generateProductImage(title: string, slug: string) {
  const imageBuffer = await createImageFromTitle(title); // placeholder function
  const imagePath = path.join(process.cwd(), 'public', 'images', `${slug}.jpg`);
  await fs.promises.writeFile(imagePath, imageBuffer);
}

/**
 * 2. Save image in correct location during creation.
 */
async function saveProductImage(slug: string, imageBuffer: Buffer) {
  const imagePath = path.join(process.cwd(), 'public', 'images', `${slug}.jpg`);
  await fs.promises.writeFile(imagePath, imageBuffer);
}

/**
 * 3. Return URL-safe path for frontend rendering.
 */
function getImageUrlForSlug(slug: string): string {
  return `/images/${slug}.jpg`;
}

export { generateProductImage, saveProductImage, getImageUrlForSlug };
