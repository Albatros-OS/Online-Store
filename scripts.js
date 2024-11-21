// Initialize database in localStorage if not already present
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

function saveToLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function hashPassword(password) {
    // A simple hash function (not suitable for production; consider using a library like bcrypt)
    return btoa(password);
}

// Save user's preference during registration
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

// Apply preference on login
function login(email, password) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const hashedPassword = hashPassword(password);
    const user = users.find(u => u.email === email && u.password === hashedPassword);
    if (user) {
        currentUser = user;
        saveToLocalStorage('currentUser', currentUser);
        showMessage('تم تسجيل الدخول بنجاح', 'success');
        updateLoginIcon(true);  // Update login icon on successful login
        showLoginPopup(true);   // Show success popup
        return true;
    } else {
        showMessage('البريد الإلكتروني أو كلمة المرور غير صحيحة', 'error');
        showLoginPopup(false);  // Show error popup
        return false;
    }
}

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

/* إظهار وإخفاء المربع */
function showLoginPopup(isSuccess) {
    var popup = document.getElementById('login-popup');
    var message = document.getElementById('login-message');
    var icon = document.getElementById('login-icon');

    if (isSuccess) {
        message.textContent = 'تسجيل الدخول ناجح';
        icon.className = 'success-icon';
    } else {
        message.textContent = 'تسجيل الدخول فشل';
        icon.className = 'error-icon';
    }

    popup.style.display = 'block';

    setTimeout(function() {
        popup.style.display = 'none';
    }, 3000); // يختفي بعد 3 ثوانٍ
}

/* تغيير أيقونة تسجيل الدخول */
function updateLoginIcon(isLoggedIn) {
    if (isLoggedIn) {
        document.getElementById('login-icon').style.display = 'none';
        document.getElementById('account-icon').style.display = 'block';
    } else {
        document.getElementById('login-icon').style.display = 'block';
        document.getElementById('account-icon').style.display = 'none';
    }
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
    // Implement logout functionality if required
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
