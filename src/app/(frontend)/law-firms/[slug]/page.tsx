import { permanentRedirect } from 'next/navigation'

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function BusinessProfilePage({ params }: PageProps) {
  const { slug } = await params
  permanentRedirect(`/thailand/lawyers/${slug}`)
}
