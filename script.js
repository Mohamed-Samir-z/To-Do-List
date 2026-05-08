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

// 2. دالة إدارة الاسم (الذكاء الاصطناعي لتجربة المستخدم)
// async function checkUsername() {
//     // رقم التحديث الحالي - خليه متوافق مع نسخة الـ SW عشان تبقى منظم
//     const APP_VERSION = "v4.2"; // غير دي لـ 4.2 دلوقتي عشان التعديل يلقط
//     let savedVersion = localStorage.getItem("appVersion");
//     let name = localStorage.getItem("userName");
//     let isRandom = localStorage.getItem("isRandomName") === "true";
//     let reloadCount = parseInt(localStorage.getItem("reloadCount") || "0");

//     // لو النسخة قديمة (مثلاً كانت v3 أو مفيش خالص)، هنصفر الاسم عشان يطلبه تاني للترحيب
//     if (savedVersion !== APP_VERSION) {
//         localStorage.setItem("appVersion", APP_VERSION);
//         name = null; // ده هيخلي الشرط اللي تحت يتحقق ويفتح الـ Alert
//     }

//     if (!name || (isRandom && reloadCount >= defaultNames.length)) {
//         localStorage.setItem("reloadCount", "0");
//         let clickCount = 0;

//         const { value: userName } = await Swal.fire({
//             // عنوان يحسس المستخدم إن فيه حاجة جديدة حصلت
//             title: '<span style="color: #4A90E2;">تحديث جديد وصل! ✨</span>',
//             html: '<b>نورّت من جديد! حابب نسجلك بلقب إيه في النسخة الجديدة؟</b>',
//             input: 'text',
//             inputPlaceholder: 'اكتب اسمك أو لقبك هنا بالعربى...',
//             showCancelButton: true,
//             cancelButtonText: 'تخطّي مؤقتاً 🏃‍♂️',
//             confirmButtonText: 'اعتمِد اللقب 💾',
//             confirmButtonColor: '#4A90E2',
//             cancelButtonColor: '#718096',
//             allowOutsideClick: false,
//             preConfirm: (value) => {
//                 if (!value && clickCount === 0) {
//                     clickCount++;
//                     Swal.showValidationMessage('عشان التحديث يكمل، يا ريت تكتب اسمك 😉');
//                     return false;
//                 }
//                 return value;
//             }
//         });

//         if (!userName || userName.trim() === "") {
//             let randomName = defaultNames[0];
//             localStorage.setItem("userName", randomName);
//             localStorage.setItem("isRandomName", "true");
//             localStorage.setItem("reloadCount", "1");
//             renderWelcomeMsg(`ال${randomName}`);
//             showPropheticGreeting(randomName);
//         } else {
//             localStorage.setItem("userName", userName);
//             localStorage.setItem("isRandomName", "false");
//             renderWelcomeMsg(userName);
//             showPropheticGreeting(userName);
//         }
//         if (localStorage.getItem("userName")){
//             showPropheticGreeting(localStorage.getItem("userName"));
//         }
//     } 
//     else if (isRandom) {
//         let nextName = defaultNames[reloadCount % defaultNames.length];
//         localStorage.setItem("userName", nextName); 
//         localStorage.setItem("reloadCount", reloadCount + 1);
//         renderWelcomeMsg(`ال${nextName}`);
//         showPropheticGreeting(nextName);
//     } 
//     else {
//         renderWelcomeMsg(name);
//         showPropheticGreeting(name , true);
//     }
// }

async function checkUsername() {
    const APP_VERSION = "v4.3";
    let savedVersion = localStorage.getItem("appVersion");
    let name = localStorage.getItem("userName");
    let isRandom = localStorage.getItem("isRandomName") === "true";
    let reloadCount = parseInt(localStorage.getItem("reloadCount") || "0");

    if (savedVersion !== APP_VERSION) {
        localStorage.setItem("appVersion", APP_VERSION);
        name = null; 
    }

    // 1. مرحلة تحديد أو تحديث الاسم (بدون نداء أي صلاة هنا)
    if (!name || (isRandom && reloadCount >= defaultNames.length)) {
        localStorage.setItem("reloadCount", "0");
        let clickCount = 0;

        const { value: userName } = await Swal.fire({
            title: '<span style="color: #4A90E2;">تحديث جديد وصل! ✨</span>',
            html: '<b>نورّت من جديد! حابب نسجلك بلقب إيه في النسخة الجديدة؟</b>',
            input: 'text',
            inputPlaceholder: 'اكتب اسمك أو لقبك هنا بالعربى...',
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

    // 2. مرحلة التحديث البصري (Render)
    const finalName = localStorage.getItem("userName");
    const isActuallyRandom = localStorage.getItem("isRandomName") === "true";
    renderWelcomeMsg(isActuallyRandom ? `ال${finalName}` : finalName);

    // 3. الضربة القاضية: نداء الصلاة "مرة واحدة فقط" لكل الحالات في نهاية الدالة
    // لو اسم جديد استنى شوية، لو قديم اشتغل فوراً
    const isNewUser = (savedVersion !== APP_VERSION || !name);
    setTimeout(() => {
        showPropheticGreeting(finalName, !isNewUser);
    }, isNewUser ? 1000 : 100); 
}


// دالة تعديل الاسم يدوياً
// دالة تعديل الاسم يدوياً بشكل "فخم"

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
        
        Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: `أهلاً بك يا ${newName} في نسختك الجديدة! 🎩`,
            showConfirmButton: false,
            timer: 2500,
            timerProgressBar: true
        });
    }
}

function renderWelcomeMsg(name) {
    const welcomeElem = document.getElementById("welcome-text");
    if (welcomeElem) welcomeElem.innerText = `قائمة مهام ${name}`; 
}

// 3. دالة الساعة
function updateClock() {
    const now = new Date();
    const dateElem = document.getElementById("live-date");
    const timeElem = document.getElementById("live-time");
    if (dateElem) dateElem.innerText = now.toLocaleDateString('ar-EG', { weekday: 'long', day: 'numeric', month: 'long' });
    if (timeElem) timeElem.innerText = now.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
}

// 4. إدارة المهام




function renderTasks() {
    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        
        // بناء هيكل المهمة (طبقتين فوق بعض)
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

        // جوه renderTasks لكل مهمة
        const taskTextSpan = li.querySelector('.task-text');
        let pressTimer;

        // لما المستخدم يبدأ يلمس الشاشة
        taskTextSpan.addEventListener('touchstart', (e) => {
            pressTimer = setTimeout(async () => {
                // ده اللي هيحصل لما يثبت صباعه لمدة ثانية
                const { value: newTaskText } = await Swal.fire({
                    title: 'تعديل المهمة ✍️',
                    input: 'text',
                    inputValue: tasks[index].text,
                    showCancelButton: true,
                    confirmButtonText: 'تحديث',
                    cancelButtonText: 'إلغاء',
                    inputValidator: (value) => {
                        if (!value) {
                            return 'ما ينفعش تسيب المهمة فاضية! 😅';
                        }
                    }
                });

                if (newTaskText) {
                    tasks[index].text = newTaskText;
                    saveAndRefresh();
                }
            }, 800); // 800 مللي ثانية يعني ثانية واحدة
        });

        // لو شال صباعه قبل الثانية، نلغي التايمر عشان ميتفتحش التعديل
        taskTextSpan.addEventListener('touchend', () => {
            clearTimeout(pressTimer);
        });

        // لو حرك صباعه (بيعمل سحب مثلاً) نلغي التايمر برضه
        taskTextSpan.addEventListener('touchmove', () => {
            clearTimeout(pressTimer);
        });

        const content = li.querySelector('.task-content');
        const checkbox = li.querySelector('input[type="checkbox"]');
        let startX = 0;
        let currentTranslate = 0;

        // منطق السحب لليمين
        content.addEventListener('touchstart', e => {
            startX = e.touches[0].clientX;
            content.style.transition = 'none'; // نلغي الانيميشن أثناء السحب
        });

        content.addEventListener('touchmove', e => {
            let moveX = e.touches[0].clientX;
            let diff = moveX - startX;

            if (diff > 0) { // سحب لليمين فقط
                currentTranslate = diff;
                content.style.transform = `translateX(${currentTranslate}px)`;
            }
        });

        content.addEventListener('touchend', () => {
            content.style.transition = 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            
            if (currentTranslate > 150) { // لو سحب مسافة كافية للحذف
                // 1. تشغيل صوت الحذف
                playDeleteSound();

                // 2. إضافة كلاس الأنيميشن (النفضة)
                li.classList.add('removing');

                // 3. تحريك العنصر بره الشاشة تماماً
                content.style.transform = 'translateX(100%)';

                // 4. الحذف الفعلي من البيانات بعد انتهاء الأنيميشن
                setTimeout(() => {
                    tasks.splice(index, 1);
                    saveAndRefresh();
                }, 400); // 400ms هي نفس مدة أنيميشن الـ CSS
            } else {
                content.style.transform = 'translateX(0)'; // يرجع لمكانه لو مسحبش كفاية
            }
            currentTranslate = 0;
        });

        // منطق التشيك بوكس
        checkbox.addEventListener('change', () => {
            audio.currentTime = 0;
            audio.play().catch(e => {});
            tasks[index].completed = checkbox.checked;
            
            if (checkbox.checked) {
                const name = localStorage.getItem("userName") || "يا بطل";
                const msg = friendlyMessages[Math.floor(Math.random() * friendlyMessages.length)](name);
                Swal.fire({
                    toast: true, position: 'top-end', icon: 'success',
                    title: msg, showConfirmButton: false, timerProgressBar: true, timer: 3000
                });
            }
            saveAndRefresh();
        });

        // داخل renderTasks - استبدل جزء الـ infoBtn والـ descDiv بهذا الكود:

        const infoBtn = li.querySelector('.info-btn');
        const descDiv = li.querySelector('.task-description');

        infoBtn.addEventListener('click', async (e) => {
            e.stopPropagation();
            
            // 1. لو مفيش وصف أصلاً، افتح الألرت فوراً للكتابة
            if (!tasks[index].desc || tasks[index].desc.trim() === "") {
                const { value: text } = await Swal.fire({
                    title: 'إضافة تفاصيل للمهمة 📝',
                    input: 'textarea',
                    inputPlaceholder: 'اكتب تفاصيل المهمة هنا...',
                    showCancelButton: true,
                    confirmButtonText: 'حفظ',
                    cancelButtonText: 'إلغاء'
                });

                if (text) {
                    tasks[index].desc = text;
                    saveAndRefresh();
                }
            } else {
                // 2. لو فيه وصف، افتحه وقفله عادي
                descDiv.classList.toggle('open');
            }
        });

        // إضافة زرار تعديل "جوه" الوصف لو كان فيه نص
        if (tasks[index].desc) {
            descDiv.innerHTML = `
                <span class="edit-desc-icon">Edit ✍️</span>
                <p>${tasks[index].desc}</p>
            `;
            
            descDiv.querySelector('.edit-desc-icon').addEventListener('click', async (e) => {
                e.stopPropagation();
                const { value: text } = await Swal.fire({
                    title: 'تعديل التفاصيل 📝',
                    input: 'textarea',
                    inputValue: tasks[index].desc,
                    showCancelButton: true,
                    confirmButtonText: 'تحديث'
                });
                if (text !== undefined) {
                    tasks[index].desc = text;
                    saveAndRefresh();
                }
            });
        }

        taskList.appendChild(li);
    });
}

function saveAndRefresh() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
}

addButton.addEventListener('click', () => {
    const val = taskInput.value.trim();
    if (val === ''){
        const name = localStorage.getItem("userName") || "يا بطل";
        
        Swal.fire({
            title: 'فين المهمة؟ 🧐',
            text: `يا ${name}، الخانة فاضية! اكتب حاجة ورينا شطارتك..`,
            icon: 'warning',
            confirmButtonText: 'حاضر، هكتب أهو ✅',
            confirmButtonColor: '#4A90E2',
            showClass: {
                popup: 'animate__animated animate__shakeX' // حركة "نفضة" خفيفة عشان تنبهه
            }
        });
        return;
    };

    // التأكد إذا كانت المهمة موجودة فعلاً
    if (tasks.some(t => t.text === val)) {
        const name = localStorage.getItem("userName") || "يا بطل";
        
        // إظهار الرسالة الفخمة
        Swal.fire({
            title: 'موجودة قبل كدة! 🧐',
            text: `يا ${name}، المهمة دي إنت ضفتها قبل كدة.. ركز وفتح عيونك الحلوه!`,
            icon: 'info',
            confirmButtonText: 'تمام، حصل خير ✅',
            confirmButtonColor: '#4A90E2',
            showClass: {
                popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOutUp'
            }
        });
        
        taskInput.value = ''; // فضي الخانة عشان يكتب حاجة جديدة
        return; 
    }

    tasks.push({ text: val, completed: false });
    taskInput.value = '';
    saveAndRefresh();
});

taskInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') addButton.click(); });

clearButton.addEventListener('click', () => {
    if (tasks.length === 0) return;

    Swal.fire({
        title: 'هل أنت متأكد؟ ⚠️',
        text: "هذا الإجراء سيمسح جميع مهامك، ولن تستطيع التراجع!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#E53E3E',
        cancelButtonColor: '#718096',
        confirmButtonText: 'نعم، امسح الكل! 🔥',
        cancelButtonText: 'تراجعت، خليهم 🛡️'
    }).then((result) => {
        if (result.isConfirmed) {
            playDeleteSound();
            tasks = [];
            saveAndRefresh();
            Swal.fire(
                'تم المسح! ✨',
                'قائمتك الآن نظيفة وجاهزة لمهام جديدة.',
                'success'
            );
        }
    });
});

const shareMessage = `
*تطبيق الـ To-Do List الأقوى!* 🚀

، جربت التطبيق ده جميل جداً؟ 
من تصميم الباشمهندس *محمد سمير* 🛠️

✅ بيشتغل *أوفلاين* تماماً (بدون إنترنت).
✅ سريع جداً ومنظم.
✅ والأهم إنه بيفكرك بـ *الصلاة على النبي ﷺ* طول ما إنت شغال.

نظّم وقتك وأنجز مهامك بذكاء من هنا:
`;
// إضافة مستمع الحدث لزرار المشاركة
const shareButton = document.getElementById('share-button');
    if (shareButton) {
        shareButton.addEventListener('click', async () => {
            const name = localStorage.getItem("userName") || "يا بطل";
            
            // رابط الموقع الحقيقي بتاعك
            const siteUrl = "https://mohamed-samir-z.github.io/To-Do-List/"; 
            
            // رابط التحميل المباشر (تأكد إن ملف الـ APK مرفوع بنفس الاسم ده)
            const apkDirectLink = siteUrl + "todo-app.apk";

            const shareMessage = `
            *تطبيق الـ To-Do List الأقوى!* 🚀

            ، جربت التطبيق ده جميل جداً؟ 
            من تصميم الباشمهندس *محمد سمير* 🛠️

            ✅ بيشتغل *أوفلاين* تماماً (بدون إنترنت).
            ✅ سريع جداً ومنظم.
            ✅ والأهم إنه بيفكرك بـ *الصلاة على النبي ﷺ* طول ما إنت شغال.

            نظّم وقتك وأنجز مهامك بذكاء من هنا:

            🔗 *رابط الموقع للتصفح والاستخدام:*
            ${siteUrl}

            📥 *رابط تحميل التطبيق مباشرة (APK):*
            ${apkDirectLink}

            *التطبيق مبعوتلك من: ${name}* 🎩
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
                console.log('User cancelled share');
            }
        });
    };

// دالة احتياطية لنسخ الرابط لو المشاركة مش مدعومة
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'تم نسخ رابط التطبيق! ارسله لأصحابك 🚀',
            showConfirmButton: false,
            timer: 2000
        });
    });
}

// ==========================================
// 5. التشغيل النهائي والترتيب المنطقي (النسخة المعتمدة)
// ==========================================

// تعريف الصوت كمتغير عام في بداية القسم
const sallaAudio = new Audio('salla.mp3');

window.addEventListener('DOMContentLoaded', () => {
    updateClock();
    setInterval(updateClock, 1000);
    renderTasks();

    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("./sw.js").catch(err => console.log(err));
    }

    // 1. نبدأ بفحص الاسم أولاً
    checkUsername();

    // 2. تفعيل مستمع الصوت لأول لمسة
    enableAudioOnFirstTouch();
});

// دالة الصوت لكسر حماية المتصفح
function enableAudioOnFirstTouch() {
    const playAudio = () => {
        // فحص: لو الاسم موجود أصلاً (يعني مفيش Alert اسم هتظهر)
        const name = localStorage.getItem("userName");
        const isRandom = localStorage.getItem("isRandomName") === "true";
        const reloadCount = parseInt(localStorage.getItem("reloadCount") || "0");
        const APP_VERSION = "v4.2";
        const savedVersion = localStorage.getItem("appVersion");

        // شرط إن الـ Alert بتاعة الاسم مش هتظهر
        if (name && savedVersion === APP_VERSION && !(isRandom && reloadCount >= defaultNames.length)) {
            sallaAudio.play().catch(e => {});
        } else {
            // لو فيه Alert اسم، بس بنفتح القناة الصوتية
            sallaAudio.play().then(() => {
                sallaAudio.pause();
                sallaAudio.currentTime = 0;
            }).catch(e => {});
        }
        
        document.removeEventListener('click', playAudio);
        document.removeEventListener('touchstart', playAudio);
    };
    document.addEventListener('click', playAudio);
    document.addEventListener('touchstart', playAudio);
}

// دالة الصلاة على النبي (بتشتغل بعد ما نتأكد من الاسم)
function showPropheticGreeting(name, playImmediately = false) {
    const username = name || localStorage.getItem("userName") || "يا بطل";
    
    // لو playImmediately بـ true، الصوت يشتغل مع أول لمسة فوراً
    if (playImmediately) {
        sallaAudio.play().catch(e => {});
    }

    setTimeout(() => {
        Swal.fire({
            title: `<span style="color: #2D3748;">صَلِّ عَلَى رَسُولِ اللهِ ﷺ</span>`,
            html: `<p style="font-size: 1.1rem;">يومك مبارك يا ${username} 🌟</p>`,
            confirmButtonText: 'عليه أفضل الصلاة والسلام',
            confirmButtonColor: '#1e3c72',
            timer: 4000,
            timerProgressBar: true,
            allowOutsideClick: true,
        }).then((result) => {
            // لو مكنش اشتغل في الأول، يشتغل هنا
            if (!playImmediately) sallaAudio.play().catch(e => {});
        });
    }, 500); 
}