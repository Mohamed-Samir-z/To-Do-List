const cacheName = 'todo-v3'; // رفعنا النسخة لـ 3 عشان يمسح العك القديم
const assets = [
    './',
    './index.html',
    './style.css',
    './script.js',
    './sweetalert2.all.min.js',
    './Click.wav',  // ضفنا الصوت هنا عشان ميوقفش الكود أوفلاين
    './icon.png'    // ضيف أي صورة بتستخدمها هنا
];

self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(cacheName).then(cache => {
            console.log('Caching assets...');
            return cache.addAll(assets);
        })
    );
});

// تفعيل الكاش الجديد ومسح القديم
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