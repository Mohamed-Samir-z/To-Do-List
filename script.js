// 1. إدارة اسم المستخدم
function getUsername() {
    let name = localStorage.getItem("userName");
    if (!name) {
        name = prompt("أهلاً بك في تحديثك الجديد! ما هو اسمك؟");
        if (name) localStorage.setItem("userName", name);
        else name = "الفخم"; // اسم افتراضي لو مكسل يكتب
    }
    return name;
}

// 2. تحديث الوقت والتاريخ
function updateClock() {
    const now = new Date();
    const name = getUsername();
    
    // تنسيق التاريخ بالعربي
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateStr = now.toLocaleDateString('en-US', dateOptions);
    
    // تنسيق الساعة
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    document.getElementById("welcome-msg").innerText = `قائمة مهام ${name}`;
    document.getElementById("current-date").innerText = dateStr;
    document.getElementById("current-time").innerText = timeStr;
}

// تشغيل الساعة وتحديثها كل دقيقة
setInterval(updateClock, 60000);
updateClock();

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
        .then(() => console.log("Service Worker Registered"))
        .catch(err => console.log("Service Worker Failed", err));
}

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