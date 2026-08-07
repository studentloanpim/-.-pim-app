// sw.js — service worker ของ "เปลือก" (shell) แอป กยศ. PIM
// หน้าที่หลักคือทำให้เบราว์เซอร์เห็นว่าเว็บนี้ "ติดตั้งเป็นแอปได้" (installability criterion)
// เนื้อหาจริงของระบบอยู่คนละโดเมน (Apps Script) จึงแคชแบบออฟไลน์เต็มรูปแบบให้ไม่ได้
// — ส่วนนี้แคชแค่ไฟล์ของหน้า splash/ไอคอนเอง
const CACHE_NAME = 'kys-pim-shell-v1';
const PRECACHE_URLS = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // แคชเฉพาะ request ที่เป็นของ shell เอง (same-origin) เท่านั้น
  if (event.request.method !== 'GET') return;
  if (new URL(event.request.url).origin !== self.location.origin) return;

  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
