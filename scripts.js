// Initialize database in localStorage if not already present
if (!localStorage.getItem('users')) {
    const users = [
        { id: 1, email: 'albatros_OS@hotmail.com', password: 'Ali12121997@#', country: 'Syria', phone: '1', role: 'owner', balance: 1000, theme: 'light' }
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

function hashPassword(password) {
    // A simple hash function (not suitable for production; consider using a library like bcrypt)
    return btoa(password);
}

// Save user's dark mode preference during registration
function register(email, password, country, phone) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
        showMessage('البريد الإلكتروني مستخدم بالفعل', 'error');
        return false;
    }
    const hashedPassword = hashPassword(password);
    const newUser = { id: users.length + 1, email, password: hashedPassword, country, phone, role: 'user', balance: 0, theme: 'light' };
    users.push(newUser);
    saveToLocalStorage('users', users);
    showMessage('تم التسجيل بنجاح', 'success');
    return true;
}

// Apply preference on login
function login(email, password) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const hashedPassword = hashPassword(password);
    const user = users.find(u => u.email === email && u.password === hashedPassword);
    if (user) {
        currentUser = user;
        saveToLocalStorage('currentUser', currentUser);
        applyTheme(user.theme); // Apply stored preference
        showMessage('تم تسجيل الدخول بنجاح', 'success');
        return true;
    } else {
        showMessage('البريد الإلكتروني أو كلمة المرور غير صحيحة', 'error');
        return false;
    }
}

// Save the new preference when it is changed
function toggleTheme() {
    if (currentUser) {
        if (document.body.classList.contains('dark-mode')) {
            applyTheme('light');
            currentUser.theme = 'light';
        } else {
            applyTheme('dark');
            currentUser.theme = 'dark';
        }
        const users = JSON.parse(localStorage.getItem('users'));
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        if (userIndex !== -1) {
            users[userIndex] = currentUser;
            saveToLocalStorage('users', users);
            saveToLocalStorage('currentUser', currentUser);
        }
    } else {
        if (document.body.classList.contains('dark-mode')) {
            applyTheme('light');
            localStorage.setItem('theme', 'light');
        } else {
            applyTheme('dark');
            localStorage.setItem('theme', 'dark');
        }
    }
}

// Function to apply the dark mode
function applyTheme(theme) {
    if (theme === 'dark') {
        document.body.classList.add('dark-mode');
        const themeToggleButton = document.querySelector('#toggle-mode');
        themeToggleButton.innerHTML = '<i class="fas fa-sun"></i> الوضع النهاري';
        themeToggleButton.style.backgroundColor = '#4165D5'; // اللون في الوضع الليلي
    } else {
        document.body.classList.remove('dark-mode');
        const themeToggleButton = document.querySelector('#toggle-mode');
        themeToggleButton.innerHTML = '<i class="fas fa-moon"></i> الوضع الليلي';
        themeToggleButton.style.backgroundColor = '#F1AC20'; // اللون في الوضع النهاري
    }
}

// Apply the stored preference when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (currentUser) {
        applyTheme(currentUser.theme);
    } else if (savedTheme) {
        applyTheme(savedTheme);
    }
});

// Bottom bar
let lastScrollTop = 0;
const bottomBar = document.getElementById('bottom-bar');

window.addEventListener('scroll', () => {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop > lastScrollTop) {
        // Scrolling down
        bottomBar.style.opacity = 0;
    } else {
        // Scrolling up
        bottomBar.style.opacity = 1;
    }
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For mobile or negative scrolling
});

// Function to display success or error messages
function showMessage(message, type) {
    const messageBox = document.createElement('div');
    messageBox.className = `message ${type}`;
    messageBox.innerText = message;
    document.body.insertBefore(messageBox, document.body.firstChild);
    setTimeout(() => {
        messageBox.remove();
    }, 3000);
}

// Event listeners
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
