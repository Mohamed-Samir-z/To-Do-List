const cacheName = 'todo-v4.5'; // غير دي لـ 4.2 دلوقتي عشان التعديل يلقط
const assets = [
    './',
    './index.html',
    './style.css',
    './script.js',
    './sweetalert2.all.min.js',
    './Click.wav',
    './icon.png',
    './switch.wav',
    './Salla.mp3'
];

self.addEventListener('install', e => {
    self.skipWaiting(); // <--- السطر ده هو "كلمة السر" للتحديث الفوري
    e.waitUntil(
        caches.open(cacheName).then(cache => {
            return cache.addAll(assets);
        })
    );
});

self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(keys
                .filter(key => key !== cacheName)
                .map(key => caches.delete(key))
            );
        })
    );
});

self.addEventListener('fetch', e => {
    e.respondWith(
        caches.match(e.request).then(res => {
            return res || fetch(e.request);
        })
    );
});