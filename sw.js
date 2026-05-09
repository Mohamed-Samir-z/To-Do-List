const cacheName = 'todo-v4.8'; // غير دي لـ 4.2 دلوقتي عشان التعديل يلقط
const assets = [
    './',
    './index.html',
    './style.css',
    './script.js',
    './sweetalert2.all.min.js',
    './Click.wav',
    './icon.png',
    './switch.wav',
    './Salla.mp3',
    './all.min.css',
    './webfonts/fa-solid-900.woff2',
    './webfonts/fa-brands-400.woff2',
    './webfonts/fa-regular-400.woff2',
    './bg-btn-img1.jpg',
    './bg-btn-img2.jpg',
    './bg-btn-img3.jpg',
    './bg-btn-img4.jpg',
    './bg-btn-img5.png'
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