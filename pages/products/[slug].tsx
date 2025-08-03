import fs from 'fs'
import path from 'path'
import { GetStaticPaths, GetStaticProps } from 'next'
import Image from 'next/image'

type Product = {
  slug: string
  title: string
  description: string
  image: string
  price: number
}

export default function ProductPage({ product }: { product: Product }) {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>{product.title}</h1>
      <Image
        src={`/images/${product.image}`}
        alt={product.title}
        width={500}
        height={500}
      />
      <p>{product.description}</p>
      <p><strong>${product.price.toFixed(2)}</strong></p>
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const filePath = path.join(process.cwd(), 'lib/products.json')
  const data = fs.readFileSync(filePath, 'utf8')
  const products: Product[] = JSON.parse(data)

  const paths = products.map(product => ({
    params: { slug: product.slug }
  }))

  return { paths, fallback: 'blocking' }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string
  const filePath = path.join(process.cwd(), 'lib/products.json')
  const data = fs.readFileSync(filePath, 'utf8')
  const products: Product[] = JSON.parse(data)
  const product = products.find(p => p.slug === slug)

  if (!product) return { notFound: true }

  return { props: { product }, revalidate: 60 }
}
