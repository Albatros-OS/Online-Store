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

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const themeToggleButton = document.querySelector('#theme-toggle i');
    if (document.body.classList.contains('dark-mode')) {
        themeToggleButton.classList.remove('fa-sun');
        themeToggleButton.classList.add('fa-moon');
    } else {
        themeToggleButton.classList.remove('fa-moon');
        themeToggleButton.classList.add('fa-sun');
    }
}

// Event listeners
document.querySelector('#login-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = e.target.query
