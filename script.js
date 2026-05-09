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

// 2. دالة الساعة (مفصلة لضمان العمل)
function updateClock() {
    const now = new Date();
    const dateElem = document.getElementById("live-date");
    const timeElem = document.getElementById("live-time");
    if (dateElem) dateElem.innerText = now.toLocaleDateString('ar-EG', { weekday: 'long', day: 'numeric', month: 'long' });
    if (timeElem) timeElem.innerText = now.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
}


// 2. دالة إدارة الاسم (تم دمج النسختين في واحدة سليمة)
async function checkUsername() {
    const APP_VERSION = "v4.9"; 
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
            inputPlaceholder: 'اكتب اسمك أو لقبك هنا انجليزي او عربي...',
            showCancelButton: true,
            cancelButtonText: 'تخطّي مؤقتاً 🏃‍♂️',
            confirmButtonText: 'اعتمِد اللقب 💾',
            confirmButtonColor: '#4A90E2',
            cancelButtonColor: '#718096',
            allowOutsideClick: false,
            preConfirm: (value) => {
                if (!value && clickCount === 0) {
                    clickCount++;
                    Swal.showValidationMessage('مش عاوز تعرفنى اسمك ، عشان التحديث يتكمل 😉');
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
        inputLabel: 'حبيت نناديك بإيه المرة دي؟',
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
            <div class="task-description">
                <p class="desc-text">${task.desc || "لا يوجد وصف لهذه المهمة..."}</p>
                <button class="edit-desc-btn">Edit✍️</button>
            </div>
        `;

        // --- داخل دالة renderTasks وجوه الـ forEach ---

        const infoBtn = li.querySelector('.info-btn');
        const descDiv = li.querySelector('.task-description');
        const editDescBtn = li.querySelector('.edit-desc-btn');

        infoBtn.addEventListener('click', async (e) => {
            e.stopPropagation();

            // 1. لو مفيش وصف مكتوب أصلاً للمهمة دي
            if (!tasks[index].desc || tasks[index].desc.trim() === "") {
                const { value: newDesc } = await Swal.fire({
                    title: 'إضافة تفاصيل 📝',
                    input: 'textarea',
                    inputPlaceholder: 'اكتب تفاصيل المهمة هنا...',
                    showCancelButton: true,
                    confirmButtonText: 'حفظ الوصف ✅',
                    cancelButtonText: 'إلغاء 🚫',
                });

                if (newDesc && newDesc.trim() !== "") {
                    tasks[index].desc = newDesc;
                    saveAndRefresh();
                    // نفتح التانة بعد الحفظ عشان يشوف اللي كتبه
                    setTimeout(() => {
                        const allLis = document.querySelectorAll('#task-list li');
                        allLis[index].querySelector('.task-description').classList.add('open');
                    }, 100);
                }
            } 
            // 2. لو فيه وصف موجود، نفتح أو نقفل التانة (Toggle)
            else {
                descDiv.classList.toggle('open');
            }
        });

        // 3. زرار "تعديل الوصف" اللي جوه التانة (يفضل موجود عشان لو حب يغير الوصف القديم)
        editDescBtn.addEventListener('click', async (e) => {
            e.stopPropagation();
            const { value: updatedDesc } = await Swal.fire({
                title: 'تعديل الوصف ✍️',
                input: 'textarea',
                inputValue: tasks[index].desc,
                showCancelButton: true,
                confirmButtonText: 'تحديث ✅',
                cancelButtonText: 'إلغاء 🚫'
            });

            if (updatedDesc !== undefined) {
                tasks[index].desc = updatedDesc;
                saveAndRefresh();
                // نفتح التانة تاني بعد التحديث
                setTimeout(() => {
                    const allLis = document.querySelectorAll('#task-list li');
                    allLis[index].querySelector('.task-description').classList.add('open');
                }, 100);
            }
        });

        const taskTextSpan = li.querySelector('.task-text');
        let pressTimer;

        // تعديل المهمة باللمس المطول
        taskTextSpan.addEventListener('touchstart', (e) => {
            pressTimer = setTimeout(() => { // شيلنا async هنا لأننا هنستخدم .then
                Swal.fire({
                    title: 'تعديل المهمة ✍️',
                    input: 'text',
                    inputValue: tasks[index].text,
                    showCancelButton: true,
                    confirmButtonText: 'تحديث',
                    cancelButtonText: 'إلغاء',
                    inputPlaceholder: 'اكتب المهمة هنا...',
                    inputValidator: (value) => {
                        if (!value || value.trim() === "") {
                            return 'ماينفعش تسيب المهمة فاضية! ⚠️';
                        }
                    }
                }).then((result) => {
                    // هنا بنشيك هل داس تحديث وهل فيه قيمة فعلاً
                    if (result.isConfirmed && result.value) {
                        tasks[index].text = result.value; // بناخد القيمة من result.value
                        saveAndRefresh();

                        Swal.fire({
                            icon: 'success',
                            title: 'تم التحديث!',
                            timer: 1000,
                            showConfirmButton: false,
                            timerProgressBar: true
                        });
                    }
                });
            }, 800);
        });

        // لازم تضيف دي عشان لو رفع إيده قبل الـ 800ms التايمر يتلغي وما يفتحش التعديل
        taskTextSpan.addEventListener('touchend', () => {
            clearTimeout(pressTimer);
        });
        taskTextSpan.addEventListener('touchmove', () => {
            clearTimeout(pressTimer);
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
                deleteAudio.currentTime = 0;
                deleteAudio.play();
                li.classList.add('removing');
                content.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    deleteTask(index);
                }, 400);
            } else {
                content.style.transform = 'translateX(0)';
            }
            currentTranslate = 0;
        });

        // تشيك بوكس
// تشيك بوكس وصوت
        li.querySelector('input').addEventListener('change', (e) => {
            audio.currentTime = 0; // يصفر الصوت عشان يشتغل فوراً لو ضغطت كتير
            audio.play().catch(() => {});
            tasks[index].completed = e.target.checked;
            if (e.target.checked) {
                const uName = localStorage.getItem("userName") || "بطل";
                Swal.fire({
                    toast: true, position: 'top-end', icon: 'success',
                    title: friendlyMessages[Math.floor(Math.random() * friendlyMessages.length)](uName),
                    showConfirmButton: false, timer: 2700, timerProgressBar: true
                });
            }
            saveAndRefresh();
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
        Swal.fire({ title: 'فين المهمة؟ 🧐',
            text: 'متشتغلنيش بقا وصل على النبى وابدأ مهام وانجازات! 😉', icon: 'warning', confirmButtonText: 'حاضر ✅' });
        return;
    }
    if (tasks.some(t => t.text === val)) {
        Swal.fire({
            title: 'موجودة قبل كدة! 🧐',
            icon: 'info',
            text: 'ركز كدا صل على النبى وافتح عيونك يجميل! 😉', 
            confirmButtonText: 'حاضر ✅' });
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
        title: ' انت متأكد؟ ⚠️',
        text: "هيمسحلك كل المهام!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'امسح الكل! 🔥',
        cancelButtonText: 'تراجعت خليهم!🙅‍♂️',
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
    }).then((result) => {
        if (result.isConfirmed) {
            deleteAudio.play();
            deleteAllTasks();
        }
    });
});

let tasksBackup = []; // مخزن مؤقت للمهام المحذوفة

function deleteAllTasks() {
    // 1. ناخد نسخة احتياطية من المهام الحالية قبل المسح
    tasksBackup = [...tasks]; 

    // 2. نمسح المهام
    tasks = [];
    saveAndRefresh();

    // 3. نظهر التنبيه مع زرار التراجع
    Swal.fire({
        text: "تم حذف جميع المهام",
        icon: 'info',
        toast: true,
        position: 'bottom-start',
        showConfirmButton: true,
        confirmButtonText: 'تراجع ↩️',
        timer: 5000, // الـ Toast هيفضل 5 ثواني عشان يلحق يدوس
        timerProgressBar: true,
    }).then((result) => {
        if (result.isConfirmed) {
            // لو داس تراجع، نرجع النسخة الاحتياطية
            tasks = [...tasksBackup];
            saveAndRefresh();
            
            Swal.fire({
                toast: true,
                position: 'bottom-start',
                title: 'تم استعادة المهام',
                icon: 'success',
                showConfirmButton: false,
                timer: 1500
            });
            audio.currentTime = 0;
            audio.play().catch(() => {});
        }
    });
}

function deleteTask(index) {
    tasksBackup = [...tasks]; // نسخة احتياطية

    tasks.splice(index, 1);
    saveAndRefresh();

    Swal.fire({
        text: "تم حذف المهمة",
        icon: 'warning',
        toast: true,
        position: 'bottom-start',
        showConfirmButton: true,
        confirmButtonText: 'تراجع',
        timer: 4000,
        timerProgressBar: true,
    }).then((result) => {
        if (result.isConfirmed) {
            tasks = [...tasksBackup];
            saveAndRefresh();
            audio.currentTime = 0;
            audio.play().catch(() => {});
        }
    });
}

let shareButton = document.getElementById('share-button');
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

    // استرجاع الألوان والثيمات
    const savedColor = localStorage.getItem('themeColor');
    const savedBtnColor = localStorage.getItem('buttonsThemeColor');
    const savedBg = localStorage.getItem('customBg');
    const savedMode = localStorage.getItem('themeMode');

    if (savedColor) applyThemeColor(savedColor);
    if (savedBtnColor) applyButtonsColor(savedBtnColor);
    if (savedBg) changeBackground(savedBg); // استخدم الدالة الموحدة
    if (savedMode === 'dark') {
        document.body.classList.add('dark-theme');
        if(modeIcon) modeIcon.textContent = '☀️';
    }
});



const sidebar = document.getElementById('settings-sidebar');
const openBtn = document.getElementById('settings-toggle');

// فتح القائمة
openBtn.addEventListener('click', () => {
    sidebar.classList.toggle("open");
    openBtn.classList.toggle("rotate"); // هيضيف الكلاس لو مش موجود ويشيله لو موجود
});

// قفل القائمة لو ضغطت براها
document.addEventListener('click', (e) => {
    if (!sidebar.contains(e.target) && !openBtn.contains(e.target)) {
        sidebar.classList.remove('open');
    }
});



// --- 1. منطق تغيير الألوان ---
const colorDots = document.querySelectorAll('.color-dot');

colorDots.forEach(dot => {
    dot.addEventListener('click', () => {
        const selectedColor = dot.getAttribute('data-color');
        applyThemeColor(selectedColor);
        
        // حفظ الاختيار
        localStorage.setItem('themeColor', selectedColor);
        
        // تحديث العلامة النشطة
        colorDots.forEach(d => d.classList.remove('active'));
        dot.classList.add('active');
    });
    
});

const customColorPicker = document.getElementById('custom-color-picker');

// استماع لتغيير اللون من الـ Picker
customColorPicker.addEventListener('input', (e) => {
    const selectedColor = e.target.value;
    
    // تطبيق اللون فوراً
    applyThemeColor(selectedColor);
    
    // حفظ اللون في الذاكرة
    localStorage.setItem('themeColor', selectedColor);
    
    // إزالة علامة الـ active من الدوائر الجاهزة
    document.querySelectorAll('.color-dot').forEach(d => d.classList.remove('active'));
});

// ملاحظة: الـ 'input' event بيغير اللون وأنت بتحرك إيدك، 
// لو عايزه يتغير بعد ما يسيب الماوس بس، استخدم 'change' بدلاً من 'input'.

function applyThemeColor(color) {
    // تغيير لون الهيدر والزراير والـ Checkbox
    document.documentElement.style.setProperty('--main-color', color);
    // لو إنت مستخدم متغيرات CSS (CSS Variables) ده هيكون أسهل بكتير
    const header = document.querySelector('header'); // أو الكلاس بتاع الهيدر عندك
    if(header) header.style.backgroundColor = color;
    
    document.querySelectorAll('.settings-btn, .add-button, .swal2-confirm').forEach(el => {
        el.style.backgroundColor = color;
    });
}

const btnColorPicker = document.getElementById('btn-color-picker');

// 1. مراقبة تغيير لون الأزرار
btnColorPicker.addEventListener('input', (e) => {
    const selectedColor = e.target.value;
    applyButtonsColor(selectedColor);
    localStorage.setItem('buttonsThemeColor', selectedColor);
});

// 2. دالة تطبيق لون الأزرار فقط
function applyButtonsColor(color) {
    document.documentElement.style.setProperty('--buttons-color', color);
}

// // 3. عند تحميل الصفحة، استرجع اللونين (الهيدر والأزرار)
// window.addEventListener('load', () => {
//     const savedBtnColor = localStorage.getItem('buttonsThemeColor');

//     if (savedBtnColor) {
//         applyButtonsColor(savedBtnColor);
//     }
// });

// --- 2. منطق الخلفية من المعرض ---

// دالة تغيير الخلفية وتخزينها
function changeBackground(bgValue) {
    document.body.style.backgroundImage = bgValue;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundAttachment = "fixed";
    document.body.style.backgroundPosition = "center";
    
    // حفظ في الـ localStorage
    localStorage.setItem('customBg', bgValue);
}

// 1. ربط زراير الصور الجاهزة (الـ 4 خلفيات)
const bgBtns = document.querySelectorAll('.bg-btn-img, .bg-btn');
bgBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const bg = btn.getAttribute('data-bg');
        if (bg === "none") {
            document.body.style.backgroundImage = "none";
            localStorage.removeItem('customBg');
        } else {
            changeBackground(bg);
        }
    });
});

// 2. تعديل كود الرفع من الجهاز (عشان يستخدم نفس الدالة)
const bgUpload = document.getElementById('bg-upload');
bgUpload.addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const base64Image = `url(${e.target.result})`;
            changeBackground(base64Image);
        };
        reader.readAsDataURL(file);
    }
});

// // --- 3. استرجاع الإعدادات عند تحميل الصفحة ---
// window.addEventListener('load', () => {
//     const savedColor = localStorage.getItem('themeColor');
//     const savedBg = localStorage.getItem('customBg');

//     if (savedColor) applyThemeColor(savedColor);
//     if (savedBg) {
//         document.body.style.backgroundImage = `url(${savedBg})`;
//         document.body.style.backgroundSize = "cover";
//         document.body.style.backgroundAttachment = "fixed";
//     }
// });

// 1. إعادة ضبط الشكل (ألوان وخلفية فقط)
document.getElementById('reset-theme').addEventListener('click', () => {
    sidebar.classList.remove('open');
    Swal.fire({
        title: 'إعادة شكل التطبيق؟',
        text: "سيرجع اللون والخلفية للوضع الأصلي، لكن اسمك ومهامك ستبقى كما هي.",
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'نعم، أعد الشكل ✨',
        cancelButtonText: 'إلغاء'
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem('themeColor');
            localStorage.removeItem('customBg');
            location.reload(); 
        }
    });
});

// 2. مسح كافة البيانات (الاسم، المهام، الشكل)
document.getElementById('reset-all').addEventListener('click', () => {
    sidebar.classList.remove('open');
    Swal.fire({
        title: 'مسح شامل للبيانات؟',
        text: "سيتم حذف الاسم، المهام، وكل الإعدادات. لن يمكنك التراجع عن هذا!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        confirmButtonText: 'نعم، امسح الكل ⚠️',
        cancelButtonText: 'إلغاء'
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.clear();
            location.reload();
        }
    });
});

const darkModeToggle = document.getElementById('dark-mode-toggle');
const modeIcon = document.getElementById('mode-icon');

// وظيفة التبديل
darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    
    // تغيير الأيقونة وحفظ الحالة
    if (document.body.classList.contains('dark-theme')) {
        modeIcon.textContent = '☀️'; // شمس للرجوع للوضع الفاتح
        localStorage.setItem('themeMode', 'dark');
    } else {
        modeIcon.textContent = '🌙'; // قمر للذهاب للوضع الليلي
        localStorage.setItem('themeMode', 'light');
    }
});

// // استرجاع الوضع عند تحميل الصفحة
// window.addEventListener('load', () => {
//     const savedMode = localStorage.getItem('themeMode');
//     if (savedMode === 'dark') {
//         document.body.classList.add('dark-theme');
//         modeIcon.textContent = '☀️';
//     }
// });

// كود الصياعة البرمجية للروابط وأنت أوفلاين
document.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', function(e) {
        // نتحقق لو الرابط خارجي (مش مجرد زرار في التطبيق) والجهاز ملوش نت
        if (this.href.includes('http') && !navigator.onLine) {
            e.preventDefault(); // نوقف الرابط مخليهوش يفتح الشاشة البنفسجي
            
            Swal.fire({
                title: '<span style="color: #4A90E2;">بذمتك يا شيخ! 🤨</span>',
                html: `
                    <div style="font-weight: bold; margin-bottom: 10px;">
                        يعني عايز تفتح الرابط وأنت قافل النت؟ <br>
                        سِحْر هو يعنى يا بطل؟ ✨😂
                    </div>
                    <p style="font-size: 0.9rem; color: #718096;">
                        افتح النت الأول وتعال دوس تاني، مستنيينك! 🏃‍♂️🌐
                    </p>
                `,
                icon: 'question', // شكل علامة الاستفهام بيبقى لايق مع "بذمتك"
                confirmButtonText: 'خلاص يا عم حقك عليا 🫡',
                confirmButtonColor: '#4A90E2',
                background: '#fff',
                backdrop: `
                    rgba(0,0,123,0.4)
                    url("./funny.webp")
                    left top
                    no-repeat
                ` // ضفتلك جيف خفيف كدة لو تحب يظهر في الخلفية (اختياري)
            });
        }
    });
});