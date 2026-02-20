export type TemplateVariables = {
  country?: string
  city?: string
  practiceArea?: string
  service?: string
  locale?: string
  [key: string]: string | undefined
}

const normalizeWhitespace = (value: string): string => value.trim().replace(/\s+/g, ' ')

const containsLawyerWord = (value: string): boolean => /\blawyers?\b/i.test(value)

export function replaceTemplateVars(template: string, variables: TemplateVariables): string {
  return template.replace(/\{([a-zA-Z0-9_]+)\}/g, (match, key) => {
    const value = variables[key]
    return value === undefined ? match : value
  })
}

export function buildPageTitle(
  template: string,
  variables: TemplateVariables,
  siteName: string,
): string {
  const title = normalizeWhitespace(replaceTemplateVars(template, variables))
  const normalizedSiteName = normalizeWhitespace(siteName)

  if (!title) {
    return normalizedSiteName
  }

  if (!normalizedSiteName) {
    return title
  }

  if (title.toLowerCase().includes(normalizedSiteName.toLowerCase())) {
    return title
  }

  return `${title} | ${normalizedSiteName}`
}

export function buildH1(name: string, location: string): string {
  const normalizedName = normalizeWhitespace(name)
  const normalizedLocation = normalizeWhitespace(location)

  if (containsLawyerWord(normalizedName)) {
    return `Find ${normalizedName} in ${normalizedLocation}`
  }

  return `Find ${normalizedName} Lawyers in ${normalizedLocation}`
}
