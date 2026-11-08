const CACHE_NAME = 'video-compressor-v1'

const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logos/cone-color.svg',
  '/logos/cone-bw.svg',
  '/logos/cone-color.png',
  '/logos/cone-bw.png',
  '/logos/monitor-color.svg',
  '/logos/monitor-bw.svg',
  '/logos/monitor-color.png',
  '/logos/monitor-bw.png',
  'https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700&display=swap'
]

// Install event precaches core assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
  )
})

// Activate event cleans up previous caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  )
})

// Fetch event serves cached assets and caches new ones dynamically
self.addEventListener('fetch', (event) => {
  const { request } = event

  // Skip non GET requests
  if (request.method !== 'GET') return

  const url = new URL(request.url)

  // Skip chrome extension schemes or other unsupported protocols
  if (!url.protocol.startsWith('http')) return

  // Navigation requests: Network first with offline fallback to cached index.html
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone()
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone))
          }
          return response
        })
        .catch(() => caches.match('/index.html').then((res) => res || caches.match('/')))
    )
    return
  }

  // Static assets and fonts: Cache first with network fallback and dynamic caching
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse

      return fetch(request)
        .then((networkResponse) => {
          // Cache successful GET responses
          if (
            networkResponse &&
            (networkResponse.status === 200 || networkResponse.type === 'opaque')
          ) {
            const clone = networkResponse.clone()
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone))
          }
          return networkResponse
        })
        .catch(() => {
          // If offline and request is an image or icon, fallback to cone logo
          if (request.destination === 'image') {
            return caches.match('/logos/cone-color.svg')
          }
          return null
        })
    })
  )
})

