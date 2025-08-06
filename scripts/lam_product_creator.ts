import fs from 'fs';
import path from 'path';

const basePath = path.join(process.cwd(), 'pages/products/');

interface ProductData {
  slug: string;
  title: string;
  description: string;
  image: string;
  price: string;
}

export function createProductPage(data: ProductData) {
  const { slug, title, description, image, price } = data;

  const content = `
import Head from 'next/head';

export default function ${slug.replace(/-/g, '_')}() {
  return (
    <>
      <Head>
        <title>${title}</title>
      </Head>
      <main className="p-10">
        <h1 className="text-4xl font-bold">${title}</h1>
        <img src="/images/${image}" alt="${title}" className="my-4 rounded-xl" />
        <p className="text-lg">${description}</p>
        <p className="text-xl font-bold mt-4">Only $${price}</p>
      </main>
    </>
  );
}
  `.trim();

  const filePath = path.join(basePath, `${slug}.tsx`);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ Created product: ${slug}`);
}
