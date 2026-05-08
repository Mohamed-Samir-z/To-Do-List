/**
 * To-Do List App - Professional Script
 * المهندس: محمد سمير
 */

// 1. الإعدادات والبيانات الأساسية
const defaultNames = ["بطل", "فخم", "قمر", "عسل"];
const taskInput = document.getElementById('task-input');
const addButton = document.getElementById('add-button');
const taskList = document.getElementById('task-list');
const clearButton = document.getElementById('clear-button');
const audio = new Audio('Click.wav');
const deleteAudio = new Audio("switch.wav");
const sallaAudio = new Audio('./Salla.mp3');
sallaAudio.preload = "auto";

const friendlyMessages = [
    (name) => `عاش يا ${name}! إنجاز عالمي والله.. بس قولي صليت على النبي النهاردة؟ ﷺ`,
    (name) => `الله ينور يا ${name}! كدة إنت في السليم.. كمل يا بطل ربنا يوفقك. 🚀`,
    (name) => `تمت بنجاح! خد لك بريك يا ${name} واشرب حاجة، بس أوعى تنسى الصلاة فى موعدها! ☕️🕋`,
    (name) => `إيه الحلاوة دي يا ${name}؟ مجهود جبار.. بارك الله فيك وفي وقتك. ❤️`,
    (name) => `وحش الكون يا ${name}! خلصت المهمة؟ صلي على النبي كدة في سرك وادعي لنا. 😊`,
    (name) => `جامد جدي! خلصت دي؟ اللي بعده يا ${name}.. وقلبك يبقى حاضر مع ربنا. 💪` ,
    (name) => `ممتاز يا ${name}! كدة إنت ماشي صح.. بس خليك فاكر إن كل مهمة بتقربك من ربنا. 🌟`
];

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// 2. دالة إدارة الاسم (تم دمج النسختين في واحدة سليمة)
async function checkUsername() {
    const APP_VERSION = "v4.5"; 
    let savedVersion = localStorage.getItem("appVersion");
    let name = localStorage.getItem("userName");
    let isRandom = localStorage.getItem("isRandomName") === "true";
    let reloadCount = parseInt(localStorage.getItem("reloadCount") || "0");

    if (savedVersion !== APP_VERSION) {
        localStorage.setItem("appVersion", APP_VERSION);
        name = null; 
    }

    if (!name || (isRandom && reloadCount >= defaultNames.length)) {
        localStorage.setItem("reloadCount", "0");
        let clickCount = 0;

        const { value: userName } = await Swal.fire({
            title: '<span style="color: #4A90E2;">تحديث جديد وصل! ✨</span>',
            html: '<b>نورّت من جديد! حابب نسجلك بلقب إيه في النسخة الجديدة؟</b>',
            input: 'text',
            inputPlaceholder: 'اكتب اسمك أو لقبك هنا مثلاً: الباشمهندس محمد...',
            showCancelButton: true,
            cancelButtonText: 'تخطّي مؤقتاً 🏃‍♂️',
            confirmButtonText: 'اعتمِد اللقب 💾',
            confirmButtonColor: '#4A90E2',
            cancelButtonColor: '#718096',
            allowOutsideClick: false,
            preConfirm: (value) => {
                if (!value && clickCount === 0) {
                    clickCount++;
                    Swal.showValidationMessage('عشان التحديث يكمل، يا ريت تكتب اسمك 😉');
                    return false;
                }
                return value;
            }
        });

        if (!userName || userName.trim() === "") {
            name = defaultNames[0];
            localStorage.setItem("userName", name);
            localStorage.setItem("isRandomName", "true");
            localStorage.setItem("reloadCount", "1");
        } else {
            name = userName;
            localStorage.setItem("userName", name);
            localStorage.setItem("isRandomName", "false");
        }
    } 
    else if (isRandom) {
        name = defaultNames[reloadCount % defaultNames.length];
        localStorage.setItem("userName", name); 
        localStorage.setItem("reloadCount", reloadCount + 1);
    } 

    const finalName = localStorage.getItem("userName");
    const isActuallyRandom = localStorage.getItem("isRandomName") === "true";
    renderWelcomeMsg(isActuallyRandom ? `ال${finalName}` : finalName);
    showPropheticGreeting(finalName);
}

// دالة تعديل الاسم يدوياً
async function editName() {
    const currentName = localStorage.getItem("userName") || "بطل";
    const { value: newName } = await Swal.fire({
        title: '<span style="color: #2D3748;">تغيير اللقب الغالي ✍️</span>',
        input: 'text',
        inputValue: currentName,
        inputLabel: 'حبيت ناديك بإيه المرة دي؟',
        inputPlaceholder: 'مثلاً: الباشمهندس محمد...',
        showCancelButton: true,
        confirmButtonText: 'تحديث اللقب ✨',
        cancelButtonText: 'خلك على قديمك 🔙',
        confirmButtonColor: '#48BB78',
        cancelButtonColor: '#E53E3E',
        inputValidator: (value) => {
            if (!value) return 'مينفعش تسيبها فاضية يا فنان! 😅';
            if (value === currentName) return 'ده لقبك الحالي أصلاً! جرب حاجة جديدة 🚀';
        }
    });

    if (newName) {
        localStorage.setItem("userName", newName);
        localStorage.setItem("isRandomName", "false");
        renderWelcomeMsg(newName);
        audio.play().catch(() => {}); 
    }
}

function renderWelcomeMsg(name) {
    const welcomeElem = document.getElementById("welcome-text");
    if (!welcomeElem) return;
    const isArabic = /[\u0600-\u06FF]/.test(name);
    welcomeElem.innerText = isArabic ? `قائمة مهام ${name}` : `${name}'s To-Do List`;
}

function updateClock() {
    const now = new Date();
    const dateElem = document.getElementById("live-date");
    const timeElem = document.getElementById("live-time");
    if (dateElem) dateElem.innerText = now.toLocaleDateString('ar-EG', { weekday: 'long', day: 'numeric', month: 'long' });
    if (timeElem) timeElem.innerText = now.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
}

// 4. إدارة المهام (إصلاح الحذف والتعديل)
function renderTasks() {
    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="swipe-bg"><span>حذف 🗑️</span></div>
            <div class="task-content">
                <label class="checkbox-btn">
                    <input type="checkbox" ${task.completed ? "checked" : ""}>
                    <span class="checkmark"></span>
                </label>
                <span class="task-text" style="${task.completed ? "text-decoration: line-through; opacity: 0.6;" : ""}">
                ${task.text}
                </span>
                <span class="info-btn">ℹ️</span> 
            </div>
            <div class="task-description">${task.desc || "اضغط لتعديل الوصف..."}</div>
        `;

        const taskTextSpan = li.querySelector('.task-text');
        let pressTimer;

        // تعديل المهمة باللمس المطول
        taskTextSpan.addEventListener('touchstart', (e) => {
            pressTimer = setTimeout(async () => {
                const { value: newTaskText } = await Swal.fire({
                    title: 'تعديل المهمة ✍️',
                    input: 'text',
                    inputValue: tasks[index].text,
                    showCancelButton: true,
                    confirmButtonText: 'تحديث',
                    cancelButtonText: 'إلغاء'
                });
                if (newTaskText) {
                    tasks[index].text = newTaskText;
                    saveAndRefresh();
                }
            }, 800);
        });

        taskTextSpan.addEventListener('touchend', () => clearTimeout(pressTimer));
        taskTextSpan.addEventListener('touchmove', () => clearTimeout(pressTimer));

        // منطق السحب للحذف
        const content = li.querySelector('.task-content');
        let startX = 0;
        let currentTranslate = 0;

        content.addEventListener('touchstart', e => {
            startX = e.touches[0].clientX;
            content.style.transition = 'none';
        });

        content.addEventListener('touchmove', e => {
            let moveX = e.touches[0].clientX;
            let diff = moveX - startX;
            if (diff > 0) {
                currentTranslate = diff;
                content.style.transform = `translateX(${currentTranslate}px)`;
            }
        });

        content.addEventListener('touchend', () => {
            content.style.transition = 'transform 0.3s ease';
            if (currentTranslate > 150) {
                deleteAudio.play();
                li.classList.add('removing');
                content.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    tasks.splice(index, 1);
                    saveAndRefresh();
                }, 400);
            } else {
                content.style.transform = 'translateX(0)';
            }
            currentTranslate = 0;
        });

        // تشيك بوكس
        li.querySelector('input').addEventListener('change', (e) => {
            audio.play();
            tasks[index].completed = e.target.checked;
            if (e.target.checked) {
                const name = localStorage.getItem("userName") || "يا بطل";
                Swal.fire({
                    toast: true, position: 'top-end', icon: 'success',
                    title: friendlyMessages[Math.floor(Math.random() * friendlyMessages.length)](name),
                    showConfirmButton: false, timer: 3000
                });
            }
            saveAndRefresh();
        });

        // الوصف
        const infoBtn = li.querySelector('.info-btn');
        const descDiv = li.querySelector('.task-description');
        infoBtn.addEventListener('click', async (e) => {
            e.stopPropagation();
            if (!tasks[index].desc) {
                const { value: text } = await Swal.fire({
                    title: 'إضافة تفاصيل 📝',
                    input: 'textarea',
                    showCancelButton: true
                });
                if (text) { tasks[index].desc = text; saveAndRefresh(); }
            } else {
                descDiv.classList.toggle('open');
            }
        });

        taskList.appendChild(li);
    });
}

function saveAndRefresh() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
}

// إضافة مهمة
addButton.addEventListener('click', () => {
    const val = taskInput.value.trim();
    if (val === '') {
        Swal.fire({ title: 'فين المهمة؟ 🧐', icon: 'warning', confirmButtonText: 'حاضر ✅' });
        return;
    }
    if (tasks.some(t => t.text === val)) {
        Swal.fire({ title: 'موجودة قبل كدة! 🧐', icon: 'info' });
        return;
    }
    tasks.push({ text: val, completed: false });
    taskInput.value = '';
    saveAndRefresh();
});

taskInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') addButton.click(); });

// حذف الكل
clearButton.addEventListener('click', () => {
    if (tasks.length === 0) return;
    Swal.fire({
        title: 'هل أنت متأكد؟ ⚠️',
        text: "هيمسح كل المهام!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'امسح الكل! 🔥'
    }).then((result) => {
        if (result.isConfirmed) {
            deleteAudio.play();
            tasks = [];
            saveAndRefresh();
        }
    });
});

shareButton.addEventListener('click', async () => {
    const name = localStorage.getItem("userName") || "يا بطل";
    
    // 1. رابط الموقع الأساسي (غير الرابط ده برابط مشروعك الحقيقي)
    const siteUrl = "https://mohamed-samir.github.io/todo-list/"; 
    
    // 2. رابط التحميل المباشر للـ APK (بيكون هو رابط الموقع + اسم الملف)
    const apkDirectLink = siteUrl + "todo-app.apk";

    const shareMessage = `
        *تطبيق To-Do List الأقوى!* 🚀
        من تصميم الباشمهندس *محمد سمير* 🛠️

        ✅ بيشتغل *أوفلاين* تماماً (بدون إنترنت).
        ✅ سريع جداً ومنظم ومتفاعل.
        ✅ والأهم إنه بيفكرك بـ *الصلاة على النبي ﷺ* طول ما إنت شغال.

        🔗 *رابط الموقع للتصفح:*
        ${siteUrl}

        📥 *رابط تحميل التطبيق مباشرة (APK):*
        ${apkDirectLink}

        _نظم وقتك وأنجز مهامك بذكاء!_
        `;

    try {
        if (navigator.share) {
            await navigator.share({
                title: 'تطبيق المهندس محمد سمير',
                text: shareMessage
            });
        } else {
            // لو مفيش دعم للمشاركة ينسخ الرسالة بالكامل
            navigator.clipboard.writeText(shareMessage).then(() => {
                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'success',
                    title: 'تم نسخ الرسالة والروابط! ارسلها الآن 🚀',
                    showConfirmButton: false,
                    timer: 2500
                });
            });
        }
    } catch (err) {
        console.log('User cancelled');
    }
});

// الصلاة على النبي
function showPropheticGreeting(name) {
    const username = name || "يا بطل";
    setTimeout(() => {
        sallaAudio.play().catch(() => {
            const playOnce = () => { sallaAudio.play(); document.removeEventListener('click', playOnce); };
            document.addEventListener('click', playOnce);
        });
        Swal.fire({
            title: `<span style="color: #2D3748;">صَلِّ عَلَى رَسُولِ اللهِ ﷺ</span>`,
            html: `<p>يومك مبارك يا ${username} 🌟</p>`,
            confirmButtonText: 'عليه أفضل الصلاة والسلام',
            confirmButtonColor: '#1e3c72',
            timer: 5000, 
            timerProgressBar: true
        });
    }, 1000);
}

// التشغيل عند التحميل
window.addEventListener('DOMContentLoaded', () => {
    updateClock();
    setInterval(updateClock, 1000);
    renderTasks();
    checkUsername();
    if ("serviceWorker" in navigator) {
        navigator.workerContainer = navigator.serviceWorker.register("./sw.js");
    }
});

