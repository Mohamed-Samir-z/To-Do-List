// مصفوفة الأسماء العشوائية
const defaultNames = ["البطل", "الفخم", "القمر", "العسل"];

// 1. دالة طلب الاسم (عند أول دخول أو لو الاسم اتمسح)
async function checkUsername() {
    let name = localStorage.getItem("userName");
    
    if (!name) {
        const { value: userName } = await Swal.fire({
            title: 'مرحباً بك!',
            input: 'text',
            inputLabel: 'اكتب اسمك عشان نخصص التطبيق ليك',
            inputPlaceholder: 'محمد مثلاً...',
            confirmButtonText: 'حفظ',
            allowOutsideClick: false,
            footer: 'ملاحظة: لو سبتها فاضية هنختارلك اسم جامد من عندنا 😉'
        });

        // إذا ترك الخانة فارغة، نختار اسم عشوائي
        let finalName = userName;
        if (!userName || userName.trim() === "") {
            finalName = defaultNames[Math.floor(Math.random() * defaultNames.length)];
        }

        localStorage.setItem("userName", finalName);
        renderWelcomeMsg(finalName);
    } else {
        renderWelcomeMsg(name);
    }
}

function renderWelcomeMsg(name) {
    const welcomeElem = document.getElementById("welcome-text");
    if (welcomeElem) {
        // بنحط الكلمة والاسم في نفس الـ h1 عشان نوفر مساحة
        welcomeElem.innerText = `قائمة مهام ${name}`; 
    }
}
// localStorage.clear();  // استخدمها لو حبيت تمسح كل البيانات وتبدأ من جديد

// 2. دالة تعديل الاسم باستخدام SweetAlert
async function editName() {
    const currentName = localStorage.getItem("userName") || "بطل";
    
    const { value: newName } = await Swal.fire({
        title: 'تعديل الاسم',
        input: 'text',
        inputValue: currentName, // يظهر الاسم القديم عشان يعدل عليه
        showCancelButton: true,
        confirmButtonText: 'تحديث',
        cancelButtonText: 'إلغاء',
        inputValidator: (value) => {
            if (!value) {
                return 'لازم تكتب اسم أو اضغط إلغاء';
            }
        }
    });

    if (newName) {
        localStorage.setItem("userName", newName);
        renderWelcomeMsg(newName);
        // تنبيه خفيف بنجاح التعديل
        Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'تم تحديث الاسم بنجاح',
            showConfirmButton: false,
            timer: 1500
        });
    }
}

// 3. دالة عرض الاسم (ثابتة)
function renderWelcomeMsg(name) {
    const welcomeElem = document.getElementById("welcome-text");
    if (welcomeElem) {
        welcomeElem.innerText = `قائمة مهام ${name}`;
    }
}

// 3. دالة تحديث الوقت فقط (كل ثانية)
function updateClock() {
    const now = new Date();
    const dateElem = document.getElementById("live-date");
    const timeElem = document.getElementById("live-time");

    if (dateElem) {
        dateElem.innerText = now.toLocaleDateString('ar-EG', { 
            weekday: 'long', day: 'numeric', month: 'long' 
        });
    }

    if (timeElem) {
        timeElem.innerText = now.toLocaleTimeString('ar-EG', { 
            hour: '2-digit', minute: '2-digit' 
        });
    }
}

// تشغيل الساعة كل ثانية
setInterval(updateClock, 1000);
updateClock();

// تشغيل فحص الاسم أول ما الصفحة تفتح
window.onload = checkUsername;

// 1. تعريف العناصر الأساسية من الـ HTML
const taskInput = document.getElementById('task-input');
const addButton = document.getElementById('add-button');
const taskList = document.getElementById('task-list');
const clearButton = document.getElementById('clear-button');
// اضافة مؤثر صوت عند التغيير
const audio = new Audio('Click.wav');
// 2. جلب البيانات من الـ LocalStorage (أو مصفوفة فارغة إذا كان أول استخدام)
// تم دمج النصوص وحالة الـ checkbox في مصفوفة واحدة لضمان الدقة
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

/**
 * 3. دالة العرض (Rendering)
 * مسؤولة عن مسح القائمة وإعادة بنائها بناءً على البيانات الحالية
 */
function renderTasks() {
    // مسح القائمة الحالية قبل إعادة الرسم
    taskList.innerHTML = '';

    tasks.forEach((task, index) => {
        // إنشاء عنصر القائمة (li)
        const li = document.createElement('li');
        
        // أ. عنصر النص (Span)
        const textSpan = document.createElement('span');
        textSpan.textContent = task.text;
        // تطبيق التنسيق إذا كانت المهمة مكتملة
        if (task.completed) {
            textSpan.style.textDecoration = 'line-through';
            textSpan.style.opacity = '0.6';
        }
        li.appendChild(textSpan);

        // ب. حاوية الـ Checkbox (باستخدام التنسيق الذي اخترته من Uiverse)
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

        // ج. زر الحذف (Delete Button)
        const deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = 'Delete';
        
        // --- الأحداث (Events) داخل العناصر ---

        // حدث تغيير حالة الـ Checkbox
        checkbox.addEventListener('change', () => {
            //استدعاء الصوت عند التغيير
            audio.currentTime = 0; // إعادة تعيين الصوت ليبدأ من البداية
            audio.play().catch(e => console.error('Error playing sound:', e));
            tasks[index].completed = checkbox.checked;
            saveAndRefresh();
        });


        // حدث الضغط على زر الحذف
        deleteBtn.addEventListener('click', () => {
            tasks.splice(index, 1); // حذف العنصر من المصفوفة بناءً على مكانه (index)
            saveAndRefresh();
        });

        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    });
}

/**
 * 4. دالة الحفظ والتحديث
 * تقوم بحفظ المصفوفة في الـ LocalStorage وإعادة عرض القائمة
 */
function saveAndRefresh() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
}

// 5. إضافة مهمة جديدة عند الضغط على الزر
addButton.addEventListener('click', () => {
    const val = taskInput.value.trim();
    
    // التحقق من المدخلات (Validation)
    if (val === '') {
        alert('Please enter a task before adding.');
        return;
    }
    if (val.length > 100) {
        alert('Please enter a task less than 100 characters.');
        return;
    }
    // منع التكرار
    if (tasks.some(t => t.text === val)) {
        alert('This task already exists.');
        return;
    }

    // إضافة الكائن الجديد للمصفوفة
    tasks.push({
        text: val,
        completed: false
    });

    taskInput.value = ''; // تفريغ الحقل
    saveAndRefresh();
});

// 6. دعم الضغط على زر Enter للإضافة
taskInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        addButton.click();
    }
});

// 7. زر المسح الشامل (Clear All)
clearButton.addEventListener('click', () => {
    if (tasks.length === 0) return; // لا يفعل شيء إذا كانت القائمة فارغة
    
    if (confirm('Are you sure you want to clear all tasks?')) {
        tasks = [];
        saveAndRefresh();
    }
});

// 8. تشغيل الدالة لأول مرة عند تحميل الصفحة لعرض المهام المخزنة
renderTasks();