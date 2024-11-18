// تعريف بعض المتغيرات
const addProductForm = document.getElementById('add-product-form');
const productTable = document.getElementById('product-table').getElementsByTagName('tbody')[0];

// تحقق إذا كان حساب المالك موجود في localStorage، وإذا لم يكن موجودًا قم بإنشائه
if (!localStorage.getItem('owner')) {
    const owner = {
        email: 'alisaedi012@gmail.com',
        password: btoa('Ali12121997@#')  // تشفير كلمة المرور باستخدام btoa
    };
    localStorage.setItem('owner', JSON.stringify(owner));
}

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

// دالة لاسترجاع المنتجات من localStorage
function getProducts() {
    const products = JSON.parse(localStorage.getItem('products'));
    if (!products) {
        return [];
    }
    return products;
}

// دالة لإضافة منتج جديد
function addProduct(product) {
    if (!product.name || !product.price || !product.image) {
        alert('الرجاء ملء جميع الحقول.');
        return;
    }
    const products = getProducts();
    products.push(product);
    localStorage.setItem('products', JSON.stringify(products));
    renderProducts();
}

// دالة لعرض المنتجات في الجدول
function renderProducts() {
    const products = getProducts(); // استرجاع المنتجات من localStorage
    productTable.innerHTML = ''; // تنظيف الجدول

    // عرض المنتجات في الجدول
    products.forEach((product, index) => {
        const row = productTable.insertRow();
        row.innerHTML = `
            <td>${product.name}</td>
            <td>${product.price}</td>
            <td><img src="${product.image}" alt="${product.name}" style="width: 50px; height: 50px;"></td>
            <td><button onclick="editProduct(${index})">تعديل</button></td>
            <td><button onclick="deleteProduct(${index})">حذف</button></td>
        `;
    });
}

// دالة لتعديل منتج
function editProduct(index) {
    const products = getProducts();
    const product = products[index];
    document.getElementById('product-name').value = product.name;
    document.getElementById('product-description').value = product.description;
    document.getElementById('product-price').value = product.price;
    document.getElementById('product-image').value = product.image;

    // تعديل المنتج عند الضغط على الزر
    addProductForm.onsubmit = function(event) {
        event.preventDefault();
        const updatedProduct = {
            name: document.getElementById('product-name').value,
            description: document.getElementById('product-description').value,
            price: document.getElementById('product-price').value,
            image: document.getElementById('product-image').value
        };

        if (!updatedProduct.name || !updatedProduct.price || !updatedProduct.image) {
            alert('الرجاء ملء جميع الحقول.');
            return;
        }

        products[index] = updatedProduct;
        localStorage.setItem('products', JSON.stringify(products)); // حفظ التعديلات في localStorage
        renderProducts();
        clearForm();
    };
}

// دالة لحذف منتج
function deleteProduct(index) {
    if (confirm("هل أنت متأكد أنك تريد حذف هذا المنتج؟")) {
        const products = getProducts();
        products.splice(index, 1); // إزالة المنتج من المصفوفة
        localStorage.setItem('products', JSON.stringify(products)); // حفظ التحديثات في localStorage
        renderProducts();
    }
}

// دالة لتنظيف النموذج
function clearForm() {
    addProductForm.reset();
}

// إضافة منتج جديد عند إرسال النموذج
addProductForm.onsubmit = function(event) {
    event.preventDefault();

    const newProduct = {
        name: document.getElementById('product-name').value,
        description: document.getElementById('product-description').value,
        price: document.getElementById('product-price').value,
        image: document.getElementById('product-image').value
    };

    addProduct(newProduct); // إضافة المنتج إلى localStorage
    clearForm();
};

// عرض المنتجات عند تحميل الصفحة (مستبدل بالبيانات المخزنة في localStorage)
window.onload = function() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || currentUser.email !== 'alisaedi012@gmail.com') {
        // إذا لم يكن هناك حساب مسجل أو الحساب ليس هو المالك، توجيه المستخدم إلى صفحة تسجيل الدخول
        window.location.href = 'login.html';
    } else {
        if (!localStorage.getItem('products')) {
            const defaultProducts = [
                { name: 'منتج افتراضي 1', price: '100', image: 'image1.jpg', description: 'وصف المنتج الافتراضي' },
                { name: 'منتج افتراضي 2', price: '200', image: 'image2.jpg', description: 'وصف المنتج الافتراضي' }
            ];
            localStorage.setItem('products', JSON.stringify(defaultProducts));
        }
        renderProducts();
    }
};

// نموذج تسجيل الدخول
const loginForm = document.getElementById('login-form');
loginForm.onsubmit = function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (login(email, password)) {
        // عند تسجيل الدخول بنجاح، يمكنك توجيه المستخدم إلى صفحة المنتجات أو صفحة المالك
        window.location.href = 'productPage.html';  // على سبيل المثال
    }
};
