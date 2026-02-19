const SITE_URL =
  process.env.NEXT_PUBLIC_SERVER_URL ||
  process.env.VERCEL_PROJECT_PRODUCTION_URL ||
  'https://example.com'

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: SITE_URL,
  sitemapBaseFileName: 'auto-sitemap',
  generateRobotsTxt: true,
  exclude: ['/admin/*', '/api/*', '/posts-sitemap.xml', '/pages-sitemap.xml', '/posts/*', '/sitemap.xml'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        disallow: ['/admin/*', '/api/*'],
      },
    ],
    additionalSitemaps: [`${SITE_URL}/sitemap.xml`],
  },
}
