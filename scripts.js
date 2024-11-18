// Initialize database in localStorage if not already present
if (!localStorage.getItem('users')) {
    const users = [
        { id: 1, email: 'alisaedi012@gmail.com', password: 'Ali12121997@#', country: 'Syria', phone: '1234567890', role: 'owner', balance: 1000 }
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

function login(email, password) {
    const users = JSON.parse(localStorage.getItem('users'));
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        currentUser = user;
        saveToLocalStorage('currentUser', currentUser);
        return true;
    }
    return false;
}

function register(email, password, country, phone) {
    const users = JSON.parse(localStorage.getItem('users'));
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
        alert('البريد الإلكتروني مستخدم بالفعل');
        return false;
    }
    const newUser = { id: users.length + 1, email, password, country, phone, role: 'user', balance: 0 };
    users.push(newUser);
    saveToLocalStorage('users', users);
    alert('تم التسجيل بنجاح');
    return true;
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    alert('تم تسجيل الخروج بنجاح');
    window.location.href = 'index.html';
}

function addProduct(name, description, price, image) {
    if (currentUser && currentUser.role === 'owner') {
        const products = JSON.parse(localStorage.getItem('products'));
        const product = { id: products.length + 1, name, description, price, image };
        products.push(product);
        saveToLocalStorage('products', products);
        alert('تمت إضافة المنتج بنجاح');
        return true;
    }
    alert('ليس لديك صلاحية لإضافة المنتجات');
    return false;
}

function addBalance(amount) {
    if (currentUser) {
        currentUser.balance += amount;
        const users = JSON.parse(localStorage.getItem('users'));
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        if (userIndex !== -1) {
            users[userIndex] = currentUser;
            saveToLocalStorage('users', users);
            saveToLocalStorage('currentUser', currentUser);
            alert(`تمت إضافة ${amount} إلى رصيدك. الرصيد الحالي: ${currentUser.balance}`);
        }
    }
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    document.querySelectorAll('header, footer').forEach(element => {
        element.classList.toggle('dark-mode');
    });
}

// Event listeners
document.querySelector('#login-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = e.target.querySelector('#username').value;
    const password = e.target.querySelector('#password').value;
    if (login(email, password)) {
        alert('تم تسجيل الدخول بنجاح');
        window.location.href = 'account.html';
    } else {
        alert('بيانات الدخول غير صحيحة');
    }
});

document.querySelector('#register-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = e.target.querySelector('#email').value;
    const password = e.target.querySelector('#password').value;
    const country = e.target.querySelector('#country').value;
    const phone = e.target.querySelector('#phone').value;
    if (register(email, password, country, phone)) {
        window.location.href = 'login.html';
    }
});

document.querySelector('#logout-btn')?.addEventListener('click', logout);

document.querySelector('#theme-toggle')?.addEventListener('click', toggleTheme);

document.querySelector('#add-product-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = e.target.querySelector('#product-name').value;
    const description = e.target.querySelector('#product-description').value;
    const price = e.target.querySelector('#product-price').value;
    const image = e.target.querySelector('#product-image').value;
    addProduct(name, description, price, image);
});

document.querySelector('#add-balance-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const amount = parseFloat(e.target.querySelector('#balance-amount').value);
    addBalance(amount);
});

// Display user information in "account.html"
if (window.location.pathname.endsWith('account.html') && currentUser) {
    document.querySelector('#account-id').innerText = currentUser.id;
    document.querySelector('#account-email').innerText = currentUser.email;
    document.querySelector('#account-country').innerText = currentUser.country;
    document.querySelector('#account-phone').innerText = currentUser.phone;
    document.querySelector('#account-balance').innerText = currentUser.balance;
}