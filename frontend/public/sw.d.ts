// Service Worker Type Declarations
// This file provides basic type safety for service worker code

export {}

declare global {
  interface ServiceWorkerGlobalScope {
    skipWaiting: () => Promise<void>
    clients: Clients
  }
}
