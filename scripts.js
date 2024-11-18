// تهيئة قاعدة البيانات في localStorage إذا لم تكن موجودة
if (!localStorage.getItem('users')) {
    const users = [
        { id: 1, email: 'alisaedi012@gmail.com', password: btoa('Ali12121997@#'), country: 'Syria', phone: '1234567890', role: 'owner', balance: 1000 }
    ];
    localStorage.setItem('users', JSON.stringify(users));
}

if (!localStorage.getItem('products')) {
    const products = [];
    localStorage.setItem('products', JSON.stringify(products));
}

let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

function saveToLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// التحقق من صحة البريد الإلكتروني
function isValidEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

// التحقق من صحة رقم الهاتف
function isValidPhone(phone) {
    const phonePattern = /^[0-9]{10,15}$/;
    return phonePattern.test(phone);
}

// تسجيل الدخول مع تشفير كلمة المرور
function login(email, password) {
    const users = JSON.parse(localStorage.getItem('users'));
    const user = users.find(u => u.email === email && u.password === btoa(password));
    if (user) {
        currentUser = user;
        saveToLocalStorage('currentUser', currentUser);
        return true;
    }
    return false;
}

// التسجيل مع التحقق من صحة البيانات
function register(email, password, confirmPassword, country, phone) {
    const users = JSON.parse(localStorage.getItem('users'));
    if (!isValidEmail(email)) {
        showAlert('البريد الإلكتروني غير صالح', 'error');
        return false;
    }
    if (password !== confirmPassword) {
        showAlert('كلمة المرور وتأكيد كلمة المرور غير متطابقتين', 'error');
        return false;
    }
    if (!isValidPhone(phone)) {
        showAlert('رقم الهاتف غير صالح', 'error');
        return false;
    }
    if (users.find(u => u.email === email)) {
        showAlert('البريد الإلكتروني مستخدم بالفعل', 'error');
        return false;
    }
    const newUser = { id: users.length + 1, email, password: btoa(password), country, phone, role: 'user', balance: 0 };
    users.push(newUser);
    saveToLocalStorage('users', users);
    showAlert('تم التسجيل بنجاح', 'success');
    return true;
}

// تسجيل الخروج
function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    showAlert('تم تسجيل الخروج بنجاح', 'info');
    window.location.href = 'index.html';
}

// تبديل الوضع الليلي
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const icon = document.querySelector('#theme-toggle i');
    icon.classList.toggle('fa-moon');
    icon.classList.toggle('fa-sun');
}

// عرض التنبيه المخصص
function showAlert(message, type) {
    const alertBox = document.createElement('div');
    alertBox.className = `alert ${type}`;
    alertBox.innerText = message;
    document.body.appendChild(alertBox);
    setTimeout(() => alertBox.remove(), 3000);
}

// التحقق من الجلسة عند تحميل صفحة الحساب
if (window.location.pathname.endsWith('account.html') && !currentUser) {
    window.location.href = 'login.html';
}

// المستمعون للأحداث
document.querySelector('#register-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;
    const confirmPassword = document.querySelector('#confirm-password').value;
    const country = document.querySelector('#country').value;
    const phone = document.querySelector('#phone').value;
    if (register(email, password, confirmPassword, country, phone)) {
        window.location.href = 'login.html';
    }
});

document.querySelector('#login-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.querySelector('#username').value;
    const password = document.querySelector('#password').value;
    if (login(email, password)) {
        showAlert('تم تسجيل الدخول بنجاح', 'success');
        window.location.href = 'account.html';
    } else {
        showAlert('بيانات الدخول غير صحيحة', 'error');
    }
});

document.querySelector('#logout-btn')?.addEventListener('click', logout);
document.querySelector('#theme-toggle')?.addEventListener('click', toggleTheme);
