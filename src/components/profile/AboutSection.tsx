import { ProfileImageGallery } from './ProfileImageGallery'

interface AboutSectionProps {
  firmName: string
  description: any
  galleryImages?: Array<{
    id: string
    url: string
    alt: string
  }>
}

const extractTextNodes = (node: any): string => {
  if (!node) return ''
  if (typeof node.text === 'string') return node.text
  if (Array.isArray(node.children)) {
    return node.children.map((child: any) => extractTextNodes(child)).join('')
  }
  return ''
}

const lexicalToHtml = (value: unknown) => {
  const rootChildren = (value as any)?.root?.children
  if (!Array.isArray(rootChildren)) return ''

  return rootChildren
    .map((node: any) => {
      if (node.type === 'paragraph') {
        const text = extractTextNodes(node).trim()
        return text ? `<p>${text}</p>` : ''
      }
      if (node.type === 'heading') {
        const text = extractTextNodes(node).trim()
        return text ? `<h3>${text}</h3>` : ''
      }
      if (node.type === 'list' && Array.isArray(node.children)) {
        const items = node.children
          .map((item: any) => {
            const itemText = extractTextNodes(item).trim()
            return itemText ? `<li>${itemText}</li>` : ''
          })
          .join('')
        return items ? `<ul>${items}</ul>` : ''
      }
      return ''
    })
    .join('')
}

export function AboutSection({ firmName, description, galleryImages = [] }: AboutSectionProps) {
  if (!description && !galleryImages.length) return null

  const html = description ? lexicalToHtml(description) : ''
  if (!html && !galleryImages.length) return null

  return (
    <section>
      <h2 className="font-heading text-2xl font-bold text-royal-900">About {firmName}</h2>
      {(html || galleryImages.length > 0) && (
        <div className="mt-4 overflow-hidden rounded-xl border border-warm-200 bg-white p-6 shadow-sm">
          {html && (
            <div
              className="prose prose-gray max-w-none text-royal-700"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          )}
          {galleryImages.length > 0 && (
            <div className={html ? 'mt-6' : ''}>
              <ProfileImageGallery images={galleryImages} />
            </div>
          )}
        </div>
      )}
    </section>
  )
}
