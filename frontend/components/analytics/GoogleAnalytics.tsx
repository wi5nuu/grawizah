'use client'

import Script from 'next/script'

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

/**
 * Google Analytics 4 Integration
 * Provides pageview tracking and custom event handling
 */
export default function GoogleAnalytics() {
  if (!GA_MEASUREMENT_ID) {
    return null
  }

  return (
    <>
      {/* Load GA script */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script
        id="google-analytics-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
              // Custom dimension for user role
              user_properties: {
                platform: 'grawizah_web'
              }
            });
            
            // Expose gtag function for custom events
            window.gtag = gtag;
          `,
        }}
      />
    </>
  )
}

/**
 * Helper function to track custom events
 * Usage: trackEvent('ai_tool_used', { tool: 'hs_code', role: 'premium' })
 */
export function trackEvent(
  action: string,
  params?: Record<string, string | number | boolean>
) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, params)
  }
}

// Type declaration for gtag
declare global {
  interface Window {
    gtag: (
      command: 'event' | 'config' | 'js' | 'set',
      targetOrConfig: string | Date,
      params?: Record<string, string | number | boolean>
    ) => void
  }
}
