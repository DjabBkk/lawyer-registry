import { permanentRedirect } from 'next/navigation'

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function LocationRedirectPage({ params }: PageProps) {
  const { slug } = await params
  permanentRedirect(`/thailand/lawyers/${slug}`)
}

