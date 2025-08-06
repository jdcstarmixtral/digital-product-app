import fs from 'fs';
import path from 'path';
import { MixtralProduct } from '@/types';

export async function writeMixtralProduct(slug: string, product: MixtralProduct): Promise<void> {
  const productsDir = path.join(process.cwd(), 'data', 'mixtral');
  const filePath = path.join(productsDir, \`\${slug}.json\`);

  await fs.promises.mkdir(productsDir, { recursive: true });
  await fs.promises.writeFile(filePath, JSON.stringify(product, null, 2), 'utf8');
}
