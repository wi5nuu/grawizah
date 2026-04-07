/**
 * Grawizah Service Worker
 * Provides offline caching, runtime caching, and installability
 */

const CACHE_NAME = 'grawizah-v1'
const RUNTIME_CACHE = 'grawizah-runtime-v1'

// Static assets to cache on install (App Shell)
const STATIC_ASSETS = [
  '/',
  '/offline.html',
  '/manifest.json',
  '/favicon.ico',
  '/icon.svg',
  '/images/android-chrome-192x192.png',
  '/images/android-chrome-512x512.png',
  '/images/apple-touch-icon.png',
]

// Runtime cacheable routes
const RUNTIME_ROUTES = [
  '/api/v1/products',
  '/api/v1/categories',
  '/api/v1/suppliers',
]

/**
 * Install event - precache static assets
 */
self.addEventListener('install', (event: ExtendableEvent) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Precaching static assets')
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('[SW] Precache failed for some assets:', err)
      })
    })
  )
  // Activate new SW immediately
  self.skipWaiting()
})

/**
 * Activate event - clean old caches
 */
self.addEventListener('activate', (event: ExtendableEvent) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter(
            (cacheName) =>
              cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE
          )
          .map((cacheName) => caches.delete(cacheName))
      )
    })
  )
  // Take control of all pages immediately
  self.clients.claim()
})

/**
 * Fetch event - serve from cache, fallback to network
 */
self.addEventListener('fetch', (event: FetchEvent) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip cross-origin requests
  if (url.origin !== location.origin) return

  // Strategy: Cache First for static assets
  if (
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'image' ||
    request.destination === 'font'
  ) {
    event.respondWith(cacheFirst(request))
    return
  }

  // Strategy: Network First for API calls and pages
  if (
    request.method === 'GET' &&
    (request.destination === '' || isRuntimeRoute(url.pathname))
  ) {
    event.respondWith(networkFirst(request))
    return
  }

  // Default: Network only for POST/PUT/DELETE
  event.respondWith(fetch(request))
})

/**
 * Cache-First Strategy
 */
async function cacheFirst(request: Request): Promise<Response> {
  const cached = await caches.match(request)
  if (cached) {
    return cached
  }

  try {
    const response = await fetch(request)
    if (response.ok) {
      const cache = await caches.open(RUNTIME_CACHE)
      cache.put(request, response.clone())
    }
    return response
  } catch (error) {
    return caches.match('/offline.html') || new Response('Offline', {
      status: 503,
      statusText: 'Service Unavailable',
    })
  }
}

/**
 * Network-First Strategy
 */
async function networkFirst(request: Request): Promise<Response> {
  try {
    const response = await fetch(request)
    if (response.ok) {
      const cache = await caches.open(RUNTIME_CACHE)
      cache.put(request, response.clone())
    }
    return response
  } catch (error) {
    const cached = await caches.match(request)
    if (cached) {
      return cached
    }
    // Fallback to offline page for navigations
    if (request.destination === '' || request.mode === 'navigate') {
      return caches.match('/offline.html') || new Response('Offline', {
        status: 503,
        statusText: 'Service Unavailable',
      })
    }
    return new Response(JSON.stringify({ error: 'Offline' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

/**
 * Check if URL matches runtime cache patterns
 */
function isRuntimeRoute(pathname: string): boolean {
  return RUNTIME_ROUTES.some((route) => pathname.startsWith(route))
}

// TypeScript declarations for Service Worker
declare let self: ServiceWorkerGlobalScope
