'use client'

import { useEffect } from 'react'

/**
 * PWAInitializer - Registers the service worker for PWA functionality
 * This enables offline support, installability, and caching
 */
export default function PWAInitializer() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      // Use the window load event to register the SW after page load
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js', { scope: '/' })
          .then((registration) => {
            console.log(
              '[PWA] Service Worker registered with scope:',
              registration.scope
            )

            // Check for updates periodically
            registration.addEventListener('updatefound', () => {
              const newWorker = registration.installing
              if (newWorker) {
                newWorker.addEventListener('statechange', () => {
                  if (
                    newWorker.state === 'installed' &&
                    navigator.serviceWorker.controller
                  ) {
                    // New service worker available, prompt user to refresh
                    if (
                      confirm(
                        'New version available! Reload to update Grawizah?'
                      )
                    ) {
                      window.location.reload()
                    }
                  }
                })
              }
            })
          })
          .catch((error) => {
            console.error('[PWA] Service Worker registration failed:', error)
          })
      })
    }
  }, [])

  return null
}
