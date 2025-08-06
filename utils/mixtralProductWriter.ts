import fs from 'fs';
import path from 'path';

export async function writeMixtralProduct(slug: string, product: any): Promise<void> {
  const outputPath = path.join(process.cwd(), 'data/products');
  const outputFile = path.join(outputPath, `${slug}.json`);

  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
  }

  fs.writeFileSync(outputFile, JSON.stringify(product, null, 2));
}
