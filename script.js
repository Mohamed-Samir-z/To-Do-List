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

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// 2. دالة إدارة الاسم (الذكاء الاصطناعي لتجربة المستخدم)
async function checkUsername() {
    // رقم التحديث الحالي - خليه متوافق مع نسخة الـ SW عشان تبقى منظم
    const APP_VERSION = "v4"; 
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
            title: '<span style="color: #4A90E2;">تحديث جديد v4 وصل! ✨</span>',
            html: '<b>نورّت من جديد! حابب نسجلك بلقب إيه في النسخة الجديدة؟</b>',
            input: 'text',
            inputPlaceholder: 'اكتب اسمك أو لقبك هنا...',
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
            title: `أهلاً بك يا ${newName} في حلتك الجديدة! 🎩`,
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
        const textSpan = document.createElement('span');
        textSpan.textContent = task.text;
        if (task.completed) { textSpan.style.textDecoration = 'line-through'; textSpan.style.opacity = '0.6'; }
        li.appendChild(textSpan);

        const labelContainer = document.createElement('label');
        labelContainer.classList.add('checkbox-btn');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        const checkmark = document.createElement('span');
        checkmark.classList.add('checkmark');
        labelContainer.appendChild(checkbox);
        labelContainer.appendChild(checkmark);
        li.appendChild(labelContainer);

        const deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = 'Delete';

        checkbox.addEventListener('change', () => {
            audio.currentTime = 0;
            audio.play().catch(e => console.error(e));
            tasks[index].completed = checkbox.checked;
            saveAndRefresh();
        });

        deleteBtn.addEventListener('click', () => {
            tasks.splice(index, 1);
            saveAndRefresh();
        });

        li.appendChild(deleteBtn);
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
    if (tasks.some(t => t.text === val)) return alert('المهمة موجودة فعلاً');
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
});