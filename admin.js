// بيانات المنتجات
let products = JSON.parse(localStorage.getItem('products')) || [];
let currentProductId = null;

// عرض المنتجات في لوحة التحكم
function displayAdminProducts() {
    const container = document.getElementById('adminProductsContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    products.forEach((product, index) => {
        const outOfStock = product.isOutOfStock || product.quantity <= 0;
        
        container.innerHTML += `
            <div class="product-card">
                ${outOfStock ? '<div class="out-of-stock-badge">نفذت الكمية</div>' : ''}
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <p><strong>السعر: ${product.price} ر.س</strong></p>
                <p>الكمية: ${product.quantity}</p>
                <div class="product-actions">
                    <button class="btn" onclick="editProduct(${index})">تعديل</button>
                    <button class="btn btn-danger" onclick="confirmDelete(${index})">حذف</button>
                    <button class="btn ${outOfStock ? 'btn-success' : 'btn-warning'}" 
                            onclick="toggleStockStatus(${index})">
                        ${outOfStock ? 'إعادة التوفير' : 'نفاذ الكمية'}
                    </button>
                </div>
            </div>
        `;
    });
}

// تبديل حالة المنتج (متوفر/نفاذ)
function toggleStockStatus(index) {
    products[index].isOutOfStock = !products[index].isOutOfStock;
    if (products[index].isOutOfStock) {
        products[index].quantity = 0;
    } else {
        products[index].quantity = products[index].quantity || 1;
    }
    saveProducts();
}

// حفظ المنتجات في localStorage
function saveProducts() {
    localStorage.setItem('products', JSON.stringify(products));
    displayAdminProducts();
}

// عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    displayAdminProducts();
});
