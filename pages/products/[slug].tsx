import { GetStaticPaths, GetStaticProps } from 'next'
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

type Props = {
  product: Product
}

export default function ProductPage({ product }: Props) {
  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>{product.title}</h1>
      <Image
        src={`/images/${product.image}`}
        alt={product.title}
        width={600}
        height={400}
      />
      <p>{product.description}</p>
      <p style={{ fontWeight: 'bold' }}>${product.price.toFixed(2)}</p>
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const filePath = path.join(process.cwd(), 'lib', 'products.json')
  const data = fs.readFileSync(filePath, 'utf8')
  const products: Product[] = JSON.parse(data)

  const paths = products.map((product) => ({
    params: { slug: product.slug }
  }))

  return { paths, fallback: 'blocking' }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string
  const filePath = path.join(process.cwd(), 'lib', 'products.json')
  const data = fs.readFileSync(filePath, 'utf8')
  const products: Product[] = JSON.parse(data)
  const product = products.find(p => p.slug === slug)

  if (!product) return { notFound: true }

  return { props: { product }, revalidate: 60 }
}
