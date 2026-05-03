const cacheName = "todo-v1";
const assets = [
    "./",
    "./index.html",
    "./style.css",
    "./script.js",
    "./Click.wav", // اتأكد إن اسم ملف الصوت صح
    "./manifest.json",
    "./icon.png",
];

// تثبيت الـ Service Worker وحفظ الملفات
self.addEventListener("install", (e) => {
    e.waitUntil(
        caches.open(cacheName).then((cache) => {
        cache.addAll(assets);
        }),
    );
});

// تشغيل الموقع من الكاش لو النت مقطوع
self.addEventListener("fetch", (e) => {
    e.respondWith(
        caches.match(e.request).then((res) => {
        return res || fetch(e.request);
        }),
    );
});

// تحديث الكاش
self.addEventListener("activate", (e) => {
    e.waitUntil(
        caches.keys().then((keys) => {
        return Promise.all(
            keys
            .filter((key) => key !== cacheName)
            .map((key) => caches.delete(key)),
        );
        }),
    );
});