// بيانات المنتجات (سيتم تخزينها في localStorage)
let products = JSON.parse(localStorage.getItem('products')) || [];

// بيانات تسجيل الدخول (يمكن تغييرها في الكود)
const adminCredentials = {
    username: "admin",
    password: "123456"
};

// التحقق من تسجيل الدخول عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // إذا كان في صفحة تسجيل الدخول
    if (window.location.pathname.includes('login.html')) {
        document.getElementById('loginForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            if (username === adminCredentials.username && password === adminCredentials.password) {
                localStorage.setItem('isAdminLoggedIn', 'true');
                window.location.href = 'admin.html';
            } else {
                document.getElementById('loginError').textContent = 'اسم المستخدم أو كلمة المرور غير صحيحة';
            }
        });
    }
    
    // إذا كان في صفحة المنتجات
    if (window.location.pathname.includes('products.html')) {
        displayProducts();
    }
});

// عرض المنتجات في صفحة المنتجات
function displayProducts() {
    const container = document.getElementById('productsContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    products.forEach((product, index) => {
        // التحقق من حالة نفاذ الكمية
        if (product.isOutOfStock || product.quantity <= 0) {
            const outOfStockCard = document.createElement('div');
            outOfStockCard.className = 'product-card out-of-stock-card';
            outOfStockCard.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <div class="out-of-stock-badge">نفذت الكمية</div>
                <p>${product.description}</p>
                <p><strong>السعر: ${product.price} ر.س</strong></p>
                <button class="btn btn-disabled" disabled>غير متوفر حالياً</button>
            `;
            container.appendChild(outOfStockCard);
            return;
        }
        
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <p><strong>السعر: ${product.price} ر.س</strong></p>
            <p>الكمية المتاحة: ${product.quantity}</p>
            <button class="btn" onclick="showPaymentModal(${index})">طلب المنتج</button>
        `;
        container.appendChild(productCard);
    });
}

// عرض نموذج الدفع
function showPaymentModal(productIndex) {
    const product = products[productIndex];
    document.getElementById('productDetails').innerHTML = `
        <h3>${product.name}</h3>
        <p>السعر: ${product.price} ر.س</p>
    `;
    document.getElementById('paymentModal').style.display = 'block';
    
    // إخفاء معلومات الدفع حتى يتم اختيار طريقة
    document.getElementById('paymentDetails').style.display = 'none';
    document.querySelectorAll('.payment-info').forEach(el => {
        el.style.display = 'none';
    });
}

// إخفاء نموذج الدفع
function hidePaymentModal() {
    document.getElementById('paymentModal').style.display = 'none';
}

// اختيار طريقة الدفع
function selectPayment(method) {
    document.getElementById('paymentDetails').style.display = 'block';
    document.querySelectorAll('.payment-info').forEach(el => {
        el.style.display = 'none';
    });
    document.getElementById(`${method}Info`).style.display = 'block';
}

// إتمام عملية الدفع
function completePayment() {
    alert('شكرًا لك! تم استلام طلبك وسيتم التواصل معك قريبًا.');
    hidePaymentModal();
}
