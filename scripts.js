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
    const products = JSON.parse(localStorage.getItem('products'));
    const product = { id: products.length + 1, name, description, price, image };
    products.push(product);
    saveToLocalStorage('products', products);
    alert('تمت إضافة المنتج بنجاح');
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

function withdrawBalance(amount) {
    if (currentUser) {
        if (currentUser.balance >= amount) {
            currentUser.balance -= amount;
            const users = JSON.parse(localStorage.getItem('users'));
            const userIndex = users.findIndex(u => u.id === currentUser.id);
            if (userIndex !== -1) {
                users[userIndex] = currentUser;
                saveToLocalStorage('users', users);
                saveToLocalStorage('currentUser', currentUser);
                alert(`تم سحب ${amount} من رصيدك. الرصيد الحالي: ${currentUser.balance}`);
            }
        } else {
            alert('رصيد غير كافٍ');
        }
    }
}

function applyTheme(theme) {
    if (theme === 'dark') {
        document.body.classList.add('dark-mode');
        const themeToggleButton = document.querySelector('#toggle-mode');
        themeToggleButton.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        document.body.classList.remove('dark-mode');
        const themeToggleButton = document.querySelector('#toggle-mode');
        themeToggleButton.innerHTML = '<i class="fas fa-moon"></i>';
    }
}

function toggleTheme() {
    if (document.body.classList.contains('dark-mode')) {
        applyTheme('light');
        localStorage.setItem('theme', 'light');
    } else {
        applyTheme('dark');
        localStorage.setItem('theme', 'dark');
    }
}

// Apply saved theme on page load
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    applyTheme(savedTheme);
}

// الشريط السفلي
let lastScrollTop = 0;
const bottomBar = document.getElementById('bottom-bar');

window.addEventListener('scroll', () => {
  let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  if (scrollTop > lastScrollTop) {
    // التمرير للأسفل
    bottomBar.style.opacity = 0;
  } else {
    // التمرير للأعلى
    bottomBar.style.opacity = 1;
  }
  lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // للهواتف أو التمرير السلبي
});

// Event listeners
document.querySelector('#login-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = e.target.querySelector('input[name="email"]').value;
    const password = e.target.querySelector('input[name="password"]').value;
    if (login(email, password)) {
        alert('تم تسجيل الدخول بنجاح');
    } else {
        alert('البريد الإلكتروني أو كلمة المرور غير صحيحة');
    }
});

document.querySelector('#register-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = e.target.querySelector('input[name="email"]').value;
    const password = e.target.querySelector('input[name="password"]').value;
    const country = e.target.querySelector('input[name="country"]').value;
    const phone = e.target.querySelector('input[name="phone"]').value;
    if (register(email, password, country, phone)) {
        alert('تم التسجيل بنجاح');
    }
});

document.querySelector('#logout-button')?.addEventListener('click', (e) => {
    logout();
});

document.querySelector('#add-product-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = e.target.querySelector('input[name="name"]').value;
    const description = e.target.querySelector('input[name="description"]').value;
    const price = e.target.querySelector('input[name="price"]').value;
    const image = e.target.querySelector('input[name="image"]').value;
    addProduct(name, description, price, image);
});

document.querySelector('#add-balance-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const amount = parseFloat(e.target.querySelector('input[name="amount"]').value);
    addBalance(amount);
});

document.querySelector('#withdraw-balance-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const amount = parseFloat(e.target.querySelector('input[name="amount"]').value);
    withdrawBalance(amount);
});

document.querySelector('#toggle-mode')?.addEventListener('click', (e) => {
    toggleTheme();
});

// الوصول إلى البريد الإلكتروني عند النقر
document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = link.href;
  });
});
