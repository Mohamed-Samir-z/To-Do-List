/**
 * To-Do List App - Professional Script
 * المهندس: محمد سمير
 */

// 1. الإعدادات والبيانات الأساسية
const defaultNames = ["البطل", "الفخم", "القمر", "العسل"];
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
async function checkUsername() {
    // رقم التحديث الحالي - خليه متوافق مع نسخة الـ SW عشان تبقى منظم
    const APP_VERSION = "v4.1"; // غير دي لـ 4.1 دلوقتي عشان التعديل يلقط
    let savedVersion = localStorage.getItem("appVersion");
    let name = localStorage.getItem("userName");
    let isRandom = localStorage.getItem("isRandomName") === "true";
    let reloadCount = parseInt(localStorage.getItem("reloadCount") || "0");

    // لو النسخة قديمة (مثلاً كانت v3 أو مفيش خالص)، هنصفر الاسم عشان يطلبه تاني للترحيب
    if (savedVersion !== APP_VERSION) {
        localStorage.setItem("appVersion", APP_VERSION);
        name = null; // ده هيخلي الشرط اللي تحت يتحقق ويفتح الـ Alert
    }

    if (!name || (isRandom && reloadCount >= defaultNames.length)) {
        localStorage.setItem("reloadCount", "0");
        let clickCount = 0;

        const { value: userName } = await Swal.fire({
            // عنوان يحسس المستخدم إن فيه حاجة جديدة حصلت
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
            let randomName = defaultNames[0];
            localStorage.setItem("userName", randomName);
            localStorage.setItem("isRandomName", "true");
            localStorage.setItem("reloadCount", "1");
            renderWelcomeMsg(randomName);
        } else {
            localStorage.setItem("userName", userName);
            localStorage.setItem("isRandomName", "false");
            renderWelcomeMsg(userName);
        }
    } 
    else if (isRandom) {
        let nextName = defaultNames[reloadCount % defaultNames.length];
        localStorage.setItem("userName", nextName); 
        localStorage.setItem("reloadCount", reloadCount + 1);
        renderWelcomeMsg(nextName);
    } 
    else {
        renderWelcomeMsg(name);
    }
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
    if (val === '') return;

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

// 5. التشغيل النهائي
window.addEventListener('DOMContentLoaded', () => {
    updateClock();
    setInterval(updateClock, 1000);
    checkUsername();
    renderTasks();
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("./sw.js").catch(err => console.log(err));
    }
    
    showPropheticGreeting();
});

function showPropheticGreeting() {
    const msg = "صَلِّ عَلَى رَسُولِ اللهِ";
    
    // 1. استدعاء ملف الصوت البشري
    const sallaAudio = new Audio('salla.mp3');
    sallaAudio.currentTime = 0; // عشان لو تم استدعاء الدالة دي أكتر من مرة، الصوت يشتغل من الأول   
    // 2. إظهار السويت ألرت
    Swal.fire({
        title: `<span style="color: #2D3748;">${msg} ﷺ</span>`,
        html: '<p style="font-size: 1.1rem;">يومك مبارك ومليء بالإنجازات يا بطل 🌟</p>',
        confirmButtonText: 'عليه أفضل الصلاة والسلام',
        confirmButtonColor: '#1e3c72',
        timer: 2800,
        timerProgressBar: true,
        didOpen: () => {
            // أول ما الألرت يفتح، الصوت يشتغل فوراً
            sallaAudio.play().catch(e => {
                console.log("المتصفح منع التشغيل التلقائي، مفيش مشكلة");
            });
        },
        showClass: {
            popup: 'animate__animated animate__zoomIn'
        },
        hideClass: {
            popup: 'animate__animated animate__fadeOut'
        }
    });
}

// 2. عدل دالة playDeleteSound عشان تبقى كدة:
function playDeleteSound() {
    deleteAudio.currentTime = 0; // عشان لو حذفت كذا حاجة ورا بعض يلحق يبدأ من الأول
    deleteAudio.play().catch(e => console.log("الصوت محتاج تفاعل من المستخدم الأول أو الاسم غلط"));
}