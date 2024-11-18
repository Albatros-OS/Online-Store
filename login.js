// نموذج تسجيل الدخول
const loginForm = document.getElementById('login-form');
loginForm.onsubmit = function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (login(email, password)) {
        // عند تسجيل الدخول بنجاح، يمكنك توجيه المستخدم إلى صفحة المنتجات أو صفحة المالك
        window.location.href = 'products.html';  // على سبيل المثال
    }
};

// دالة لتسجيل الدخول
function login(email, password) {
    const owner = JSON.parse(localStorage.getItem('owner'));
    if (owner && owner.email === email && owner.password === btoa(password)) {
        alert('تم تسجيل الدخول بنجاح');
        localStorage.setItem('currentUser', JSON.stringify(owner));  // حفظ المستخدم الحالي
        return true;
    } else {
        alert('البريد الإلكتروني أو كلمة المرور غير صحيحة');
        return false;
    }
}
