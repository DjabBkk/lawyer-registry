import { permanentRedirect } from 'next/navigation'

export default async function LawFirmsIndexPage() {
  permanentRedirect('/thailand/lawyers')
}
