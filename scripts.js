// تهيئة قاعدة البيانات في localStorage إذا لم تكن موجودة
if (!localStorage.getItem('users')) {
    const users = [
        { id: 1, email: 'albatros_OS@hotmail.com', password: 'Ali12121997@#', country: 'Syria', phone: '1', role: 'owner', balance: 1000 }
    ];
    localStorage.setItem('users', JSON.stringify(users));
}

if (!localStorage.getItem('products')) {
    const products = [];
    localStorage.setItem('products', JSON.stringify(products));
}

let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

// حفظ البيانات في LocalStorage
function saveToLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// دالة تجزئة كلمات المرور (للاختبار فقط، استخدم مكتبة أكثر أمانًا للإنتاج)
function hashPassword(password) {
    return btoa(password);
}

// تسجيل مستخدم جديد
function register(email, password, country, phone) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
        showMessage('البريد الإلكتروني مستخدم بالفعل', 'error');
        return false;
    }
    const hashedPassword = hashPassword(password);
    const newUser = { id: users.length + 1, email, password: hashedPassword, country, phone, role: 'user', balance: 0 };
    users.push(newUser);
    saveToLocalStorage('users', users);
    showMessage('تم التسجيل بنجاح', 'success');
    return true;
}

// تسجيل الدخول
function login(email, password) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const hashedPassword = hashPassword(password);
    const user = users.find(u => u.email === email && u.password === hashedPassword);
    if (user) {
        currentUser = user;
        saveToLocalStorage('currentUser', currentUser);
        updateLoginIcon(true);
        showLoginPopup(true);
        setTimeout(() => {
            window.location.href = 'account.html';
        }, 3000);
        return true;
    } else {
        showMessage('البريد الإلكتروني أو كلمة المرور غير صحيحة', 'error');
        showLoginPopup(false);
        return false;
    }
}

// تحديث أيقونة تسجيل الدخول
function updateLoginIcon(isLoggedIn) {
    const loginNavItem = document.getElementById('login-nav-item');
    if (isLoggedIn) {
        loginNavItem.innerHTML = '<a href="account.html"><i class="fas fa-user"></i> حسابي</a>';
    } else {
        loginNavItem.innerHTML = '<a href="login.html"><i class="fas fa-sign-in-alt"></i> تسجيل الدخول</a>';
    }
}

// تسجيل الخروج
function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateLoginIcon(false);
    window.location.href = 'index.html';
}

// إضافة منتج
function addProduct(name, description, price, image) {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const newProduct = { id: products.length + 1, name, description, price: parseFloat(price), image };
    products.push(newProduct);
    saveToLocalStorage('products', products);
    showMessage('تم إضافة المنتج بنجاح', 'success');
}

// إضافة رصيد
function addBalance(amount) {
    if (currentUser && amount > 0) {
        currentUser.balance += amount;
        saveToLocalStorage('currentUser', currentUser);

        const users = JSON.parse(localStorage.getItem('users'));
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        users[userIndex] = currentUser;
        saveToLocalStorage('users', users);

        showMessage(`تم إضافة ${amount} ريال إلى رصيدك`, 'success');
        document.getElementById('account-balance').textContent = `${currentUser.balance} ريال`;
    } else {
        showMessage('الرجاء إدخال مبلغ صحيح!', 'error');
    }
}

// سحب الرصيد
function withdrawBalance(amount) {
    if (currentUser && amount > 0 && currentUser.balance >= amount) {
        currentUser.balance -= amount;
        saveToLocalStorage('currentUser', currentUser);

        const users = JSON.parse(localStorage.getItem('users'));
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        users[userIndex] = currentUser;
        saveToLocalStorage('users', users);

        showMessage(`تم سحب ${amount} ريال من رصيدك`, 'success');
        document.getElementById('account-balance').textContent = `${currentUser.balance} ريال`;
    } else {
        showMessage('رصيد غير كافٍ أو مبلغ غير صحيح!', 'error');
    }
}

// عرض الرسائل للمستخدم
function showMessage(message, type) {
    const messageBox = document.createElement('div');
    messageBox.className = `message ${type}`;
    messageBox.textContent = message;
    document.body.insertBefore(messageBox, document.body.firstChild);
    setTimeout(() => {
        messageBox.remove();
    }, 3000);
}

// عرض أو إخفاء نافذة تسجيل الدخول
function showLoginPopup(isSuccess) {
    const popup = document.getElementById('login-popup');
    const message = document.getElementById('login-message');
    const icon = document.getElementById('login-icon');

    if (isSuccess) {
        message.textContent = 'تسجيل الدخول ناجح';
        icon.className = 'fas fa-check-circle success-icon';
    } else {
        message.textContent = 'تسجيل الدخول فشل';
        icon.className = 'fas fa-times-circle error-icon';
    }

    popup.style.display = 'block';

    setTimeout(() => {
        popup.style.display = 'none';
    }, 3000);
}

// تهيئة الأزرار والنماذج
document.querySelector('#login-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = e.target.querySelector('input[name="email"]').value;
    const password = e.target.querySelector('input[name="password"]').value;
    login(email, password);
});

document.querySelector('#register-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = e.target.querySelector('input[name="email"]').value;
    const password = e.target.querySelector('input[name="password"]').value;
    const country = e.target.querySelector('input[name="country"]').value;
    const phone = e.target.querySelector('input[name="phone"]').value;
    register(email, password, country, phone);
});

document.querySelector('#logout-button')?.addEventListener('click', logout);

document.querySelector('#add-balance-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const amount = parseFloat(e.target.querySelector('input[name="balance-amount"]').value);
    addBalance(amount);
});
