import fs from 'fs';
import path from 'path';

export function writeMixtralProduct(slug: string, productData: any) {
  const dirPath = path.join(process.cwd(), 'data', 'products');
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  const filePath = path.join(dirPath, \`\${slug}.json\`);
  fs.writeFileSync(filePath, JSON.stringify(productData, null, 2), 'utf-8');
}
