interface AboutSectionProps {
  firmName: string
  description: any
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

export function AboutSection({ firmName, description }: AboutSectionProps) {
  if (!description) return null

  const html = lexicalToHtml(description)
  if (!html) return null

  return (
    <section>
      <h2 className="font-heading text-2xl font-bold text-royal-900">About {firmName}</h2>
      <div
        className="prose prose-gray mt-4 max-w-none text-royal-700"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </section>
  )
}

