// 🌸 꽃피움 Service Worker v1.0
const CACHE = 'kkotpium-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

// 설치 — 필수 파일 캐시
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS))
  );
  self.skipWaiting();
});

// 활성화 — 이전 버전 캐시 삭제
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// 요청 처리 — 캐시 우선, 없으면 네트워크
self.addEventListener('fetch', e => {
  // 광고 요청은 캐시하지 않음
  if (e.request.url.includes('googlesyndication') ||
      e.request.url.includes('doubleclick') ||
      e.request.url.includes('googletagservices')) {
    return;
  }
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
