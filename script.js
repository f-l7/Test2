// بيانات المنتجات
let products = JSON.parse(localStorage.getItem('products')) || [];

// عرض المنتجات
function displayProducts() {
    const container = document.getElementById('productsContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    products.forEach((product, index) => {
        if (product.isOutOfStock || product.quantity <= 0) {
            container.innerHTML += `
                <div class="product-card">
                    <img src="${product.image}" alt="${product.name}">
                    <div class="out-of-stock-badge">نفذت الكمية</div>
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                    <p><strong>السعر: ${product.price} ر.س</strong></p>
                    <button class="btn btn-disabled" disabled>غير متوفر</button>
                </div>
            `;
            return;
        }
        
        container.innerHTML += `
            <div class="product-card">
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <p><strong>السعر: ${product.price} ر.س</strong></p>
                <p>الكمية: ${product.quantity}</p>
                <button class="btn" onclick="addToCart(${index})">إضافة إلى السلة</button>
            </div>
        `;
    });
}

// عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    displayProducts();
});
