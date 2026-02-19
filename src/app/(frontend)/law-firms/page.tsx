import { permanentRedirect } from 'next/navigation'

export default async function BusinessesIndexPage() {
  permanentRedirect('/thailand/lawyers')
}
