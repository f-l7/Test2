// متغيرات النظام
let currentProductId = null;
let products = JSON.parse(localStorage.getItem('products')) || [];

// عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    loadProductData();
    setupEventListeners();
});

// تحميل بيانات المنتج للتعديل
function loadProductData() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    if (productId) {
        currentProductId = productId;
        const product = products.find(p => p.id == productId);
        
        if (product) {
            document.getElementById('pageTitle').textContent = `تعديل ${product.name}`;
            document.getElementById('formTitle').textContent = `تعديل ${product.name}`;
            document.getElementById('productId').value = product.id;
            document.getElementById('productName').value = product.name;
            document.getElementById('productDescription').value = product.description;
            document.getElementById('productPrice').value = product.price;
            document.getElementById('productQuantity').value = product.quantity;
            
            if (product.image) {
                const preview = document.getElementById('productImagePreview');
                preview.src = product.image;
                preview.style.display = 'block';
            }
        }
    }
}

// إعداد مستمعي الأحداث
function setupEventListeners() {
    // معاينة الصورة
    document.getElementById('productImage').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const preview = document.getElementById('productImagePreview');
                preview.src = event.target.result;
                preview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });

    // حفظ المنتج
    document.getElementById('productForm').addEventListener('submit', function(e) {
        e.preventDefault();
        saveProduct();
    });
}

// حفظ المنتج (إنشاء/تعديل)
function saveProduct() {
    const productData = {
        id: currentProductId || Date.now(),
        name: document.getElementById('productName').value,
        description: document.getElementById('productDescription').value,
        price: document.getElementById('productPrice').value,
        quantity: document.getElementById('productQuantity').value,
        image: document.getElementById('productImagePreview').src || '',
        isOutOfStock: document.getElementById('productQuantity').value <= 0,
        lastUpdated: new Date().toISOString()
    };

    // تحديث أو إضافة منتج
    if (currentProductId) {
        const index = products.findIndex(p => p.id == currentProductId);
        if (index !== -1) {
            products[index] = productData;
        }
    } else {
        products.push(productData);
    }

    localStorage.setItem('products', JSON.stringify(products));
    alert('تم حفظ المنتج بنجاح!');
    window.location.href = 'admin.html';
}

// حذف المنتج (يتم استدعاؤها من admin.html)
function deleteProduct(productId) {
    if (confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
        products = products.filter(p => p.id != productId);
        localStorage.setItem('products', JSON.stringify(products));
        window.location.reload();
    }
}

// تبديل حالة نفاذ الكمية (يتم استدعاؤها من admin.html)
function toggleStockStatus(productId) {
    const product = products.find(p => p.id == productId);
    if (product) {
        product.isOutOfStock = !product.isOutOfStock;
        product.quantity = product.isOutOfStock ? 0 : (product.quantity || 1);
        localStorage.setItem('products', JSON.stringify(products));
        window.location.reload();
    }
}
