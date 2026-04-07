import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const env = process.env.NODE_ENV
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://grawizah.com'

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/products',
          '/suppliers',
          '/buyers',
          '/categories',
          '/about',
          '/blog',
          '/contact',
          '/pricing',
        ],
        disallow: [
          '/dashboard',
          '/login',
          '/register',
          '/forgot-password',
          '/reset-password',
          '/api/',
          '/admin/',
          '/_next/',
        ],
      },
      {
        userAgent: 'GPTBot',
        allow: ['/products', '/suppliers', '/about', '/blog', '/pricing'],
        disallow: ['/dashboard', '/api/', '/admin/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
