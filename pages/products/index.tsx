import Link from 'next/link'
import Image from 'next/image'
import fs from 'fs'
import path from 'path'

type Product = {
  slug: string
  title: string
  description: string
  image: string
  price: number
}

export async function getStaticProps() {
  const filePath = path.join(process.cwd(), 'lib', 'products.json')
  const data = fs.readFileSync(filePath, 'utf8')
  const products: Product[] = JSON.parse(data)

  return { props: { products }, revalidate: 60 }
}

export default function ProductList({ products }: { products: Product[] }) {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>All Products</h1>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.5rem'
      }}>
        {products.map(product => (
          <div key={product.slug} style={{
            border: '1px solid #ccc',
            padding: '1rem',
            borderRadius: '0.5rem'
          }}>
            <Link href={`/products/${product.slug}`}>
              <a>
                <Image
                  src={`/images/${product.image}`}
                  alt={product.title}
                  width={300}
                  height={200}
                />
                <h2>{product.title}</h2>
                <p>${product.price.toFixed(2)}</p>
              </a>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
