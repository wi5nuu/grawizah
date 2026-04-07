import type { Metadata, Viewport } from 'next'
import { Montserrat } from 'next/font/google'   
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { AuthProvider } from '@/contexts/AuthContext'
import { LanguageProvider } from '@/contexts/LanguageContext'
import PWAInitializer from '@/components/pwa/PWAInitializer'
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics'

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
})

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://grawizah.com'

export const metadata: Metadata = {
  title: {
    default: 'Grawizah - Secure, Fast, & Intelligent Global Trade',
    template: '%s | Grawizah Intelligence Hub',
  },
  description:
    'The Next-Gen B2B Export-Import Intelligence & Marketplace Hub. Connect with verified global traders, access AI-powered compliance tools, and unlock market intelligence for international trade.',
  keywords: [
    'B2B',
    'export',
    'import',
    'trade',
    'intelligence',
    'marketplace',
    'HS Code',
    'sanction screening',
    'compliance',
    'buyer radar',
    'global trade',
    'supplier directory',
  ],
  authors: [{ name: 'Grawizah Team', url: SITE_URL }],
  creator: 'Grawizah',
  publisher: 'Grawizah Intelligence Hub',
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: '/',
    languages: {
      'en-US': `${SITE_URL}/en`,
      'id-ID': `${SITE_URL}/id`,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    title: 'Grawizah - Intelligent B2B Export-Import Platform',
    description:
      'Connect with verified global traders, access AI-powered compliance tools, and unlock market intelligence.',
    siteName: 'Grawizah Intelligence Hub',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Grawizah - Secure, Fast, & Intelligent Global Trade',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Grawizah - Intelligent B2B Export-Import Platform',
    description:
      'Connect with verified global traders, access AI-powered compliance tools, and unlock market intelligence.',
    images: ['/images/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.json',
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#6D28D9',
}

// JSON-LD Structured Data for Organization
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Grawizah Intelligence Hub',
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  description:
    'The Next-Gen B2B Export-Import Intelligence & Marketplace Hub',
  sameAs: [
    'https://twitter.com/grawizah',
    'https://linkedin.com/company/grawizah',
    'https://facebook.com/grawizah',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    email: 'support@grawizah.com',
  },
  offers: {
    '@type': 'Offer',
    name: 'B2B Trade Intelligence Platform',
    category: 'Software Application',
  },
}

// JSON-LD Structured Data for WebSite
const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Grawizah',
  url: SITE_URL,
  description: 'B2B Export-Import Intelligence & Marketplace Hub',
  potentialAction: {
    '@type': 'SearchAction',
    target: `${SITE_URL}/products?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${montserrat.variable} scroll-smooth`}>
      <head>
        <link rel="icon" href="/images/favicon.ico" sizes="any" />
        <link rel="icon" href="/images/favicon-32x32.png" type="image/png" sizes="32x32" />
        <link rel="icon" href="/images/favicon-16x16.png" type="image/png" sizes="16x16" />
        <link rel="apple-touch-icon" href="/images/apple-touch-icon.png" sizes="180x180" />
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
        {/* Security Headers via meta (complement with server-level headers) */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        <meta
          httpEquiv="Content-Security-Policy"
          content="default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https: blob:; connect-src 'self' http://localhost:8081 https://api.groq.com https://*.supabase.co https://www.google-analytics.com https://www.googletagmanager.com; frame-ancestors 'none';"
        />
        <meta name="referrer" content="strict-origin-when-cross-origin" />
      </head>
      <body className="min-h-screen bg-neutral-50 flex flex-col antialiased text-neutral-900">
        {/* Skip to content link for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary-600 focus:text-white focus:rounded-lg focus:shadow-lg"
        >
          Skip to main content
        </a>
        <AuthProvider>
          <LanguageProvider>
            <Navbar />
            <main id="main-content" className="flex-1 w-full" role="main" aria-label="Main content">
              {children}
            </main>
            <Footer />
            <PWAInitializer />
            <GoogleAnalytics />
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
