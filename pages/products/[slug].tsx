import { GetStaticProps, GetStaticPaths } from 'next'
import fs from 'fs'
import path from 'path'
import Image from 'next/image'

type Product = {
  title: string
  description: string
  price: string
  slug: string
  image?: string
}

export default function ProductPage({ product }: { product: Product }) {
  return (
    <div style={{ padding: 20 }}>
      <h1>{product.title}</h1>
      <Image
        src={product.image || '/images/default.jpg'}
        alt={product.title}
        width={600}
        height={400}
      />
      <p>{product.description}</p>
      <strong>{product.price}</strong>
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const filePath = path.join(process.cwd(), 'data/products.json')
  const data = fs.readFileSync(filePath, 'utf8')
  const products: Product[] = JSON.parse(data)

  const paths = products.map(product => ({
    params: { slug: product.slug }
  }))

  return { paths, fallback: 'blocking' }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string
  const filePath = path.join(process.cwd(), 'data/products.json')
  const data = fs.readFileSync(filePath, 'utf8')
  const products: Product[] = JSON.parse(data)
  const product = products.find(p => p.slug === slug)

  if (!product) return { notFound: true }

  return { props: { product }, revalidate: 60 }
}
