import fs from 'fs';
import path from 'path';

/**
 * Writes a product JSON file to /data/products/
 */
export function writeProductFile(product: {
  slug: string;
  title: string;
  description: string;
  image: string;
  price: number;
}) {
  const dir = path.join(process.cwd(), 'data/products');
  const filePath = path.join(dir, `${product.slug}.json`);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(filePath, JSON.stringify(product, null, 2));
  console.log(`✅ Wrote product JSON: ${filePath}`);
}

/**
 * Creates a .tsx file for the product page under /pages/products/
 */
export function writeProductPage(product: {
  slug: string;
  title: string;
  description: string;
  image: string;
  price: number;
}) {
  const dir = path.join(process.cwd(), 'pages/products');
  const filePath = path.join(dir, `${product.slug}.tsx`);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const content = `import Image from 'next/image';
import Link from 'next/link';

export default function ${toComponentName(product.slug)}() {
  return (
    <div className="min-h-screen bg-white px-4 py-10">
      <div className="max-w-3xl mx-auto">
        <Image src="${product.image}" alt="${product.title}" width={800} height={500} className="rounded-xl mb-6" />
        <h1 className="text-3xl font-bold mb-2">${product.title}</h1>
        <p className="text-lg mb-4">${product.description}</p>
        <div className="text-xl font-semibold mb-6">Only $${product.price.toFixed(2)}</div>
        <Link href="/funnel/payment?product=${product.slug}">
          <button className="bg-purple-700 text-white px-6 py-3 rounded-xl transition w-full">Order Now</button>
        </Link>
      </div>
    </div>
  );
}

function ${toComponentName(product.slug)}() {}
`;

  fs.writeFileSync(filePath, content);
  console.log(`✅ Wrote product page: ${filePath}`);
}

/**
 * Converts slug to a valid component name (e.g. soul-shift → SoulShift)
 */
function toComponentName(slug: string): string {
  return slug
    .split(/[-_]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}
