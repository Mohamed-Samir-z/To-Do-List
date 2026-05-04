const cacheName = "todo-v1";
const assets = [
    "./",
    "./index.html",
    "./style.css",
    "./script.js",
    "./sweetalert2.all.min.js", // ضيف المكتبة هنا عشان تشتغل أوفلاين
    "./icon.png",
];

// تثبيت الـ Service Worker وتخزين الملفات
self.addEventListener("install", (e) => {
    e.waitUntil(
        caches.open(cacheName).then((cache) => {
        cache.addAll(assets);
        }),
    );
});

// تشغيل التطبيق من الكاش في حال عدم وجود نت
self.addEventListener("fetch", (e) => {
    e.respondWith(
        caches.match(e.request).then((res) => {
        return res || fetch(e.request);
        }),
    );
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
if ("serviceWorker" in navigator) {
    navigator.serviceWorker
        .register("./sw.js")
        .then(() => console.log("Service Worker Registered"))
        .catch((err) => console.log("Service Worker Failed", err));
}
