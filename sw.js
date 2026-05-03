const CACHE_NAME = "todo-v3";
const ASSETS_TO_CACHE = [
    "./",
    "./index.html",
    "./style.css",
    "./script.js",
    "./Click.wav",
    "./manifest.json",
    "./icon.png",
];

// 1. مرحلة التثبيت: حفظ الملفات الأساسية في الذاكرة
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
        console.log("جاري حفظ ملفات الموقع في الكاش...");
        return cache.addAll(ASSETS_TO_CACHE);
        }),
    );
    // تخطي الانتظار لتفعيل التحديث فوراً
    self.skipWaiting();
});

// 2. مرحلة التفعيل: مسح الكاش القديم لو غيرنا الإصدار
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
        return Promise.all(
            cacheNames.map((cache) => {
            if (cache !== CACHE_NAME) {
                console.log("مسح الكاش القديم...");
                return caches.delete(cache);
            }
            }),
        );
        }),
    );
    return self.clients.claim();
});

// 3. الاستجابة للطلبات (السر هنا عشان الإدخال يشتغل)
self.addEventListener("fetch", (event) => {
    event.respondWith(
        // بنحاول نجيب الملف من النت أولاً عشان لو فيه تحديثات
        fetch(event.request).catch(() => {
        // لو مفيش نت، بنطلعه من الكاش اللي حفظناه
        return caches.match(event.request);
        }),
    );
});

// تسجيل الـ Service Worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
        .then(() => console.log("Service Worker Registered"))
        .catch(err => console.log("Service Worker Failed", err));
};