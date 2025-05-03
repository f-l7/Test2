// بيانات المنتجات (سيتم تخزينها في localStorage)
let products = JSON.parse(localStorage.getItem('products')) || [];
let currentProductId = null;
let deleteProductId = null;
let outOfStockProductId = null;

// عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // التحقق من تسجيل الدخول
    if (!localStorage.getItem('isAdminLoggedIn') && !window.location.pathname.includes('login.html')) {
        window.location.href = 'login.html';
        return;
    }
    
    // إذا كان في صفحة لوحة التحكم
    if (window.location.pathname.includes('admin.html')) {
        displayAdminProducts();
    }
    
    // إذا كان في صفحة تعديل/إضافة منتج
    if (window.location.pathname.includes('edit-product.html')) {
        loadProductForEdit();
        document.getElementById('productForm').addEventListener('submit', saveProduct);
        
        // عرض معاينة الصورة عند اختيارها
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
    }
});

// عرض المنتجات في لوحة التحكم
function displayAdminProducts() {
    const container = document.getElementById('adminProductsContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    products.forEach((product, index) => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        let stockStatus = '';
        if (product.isOutOfStock || product.quantity <= 0) {
            stockStatus = `
                <div class="stock-status">
                    <span class="out-of-stock-badge">نفذت الكمية</span>
                    <button class="btn btn-restock" onclick="restockProduct(${index})">إعادة التخزين</button>
                </div>
            `;
        } else {
            stockStatus = `
                <div class="stock-status">
                    <span class="in-stock-badge">متوفر (${product.quantity})</span>
                </div>
            `;
        }
        
        productCard.innerHTML = `
            ${stockStatus}
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <p><strong>السعر: ${product.price} ر.س</strong></p>
            <div class="quantity-controls">
                <button class="btn btn-quantity" onclick="decreaseQuantity(${index})">-</button>
                <input type="number" value="${product.quantity}" min="0" id="quantity-${index}" 
                       onchange="updateQuantity(${index}, this.value)">
                <button class="btn btn-quantity" onclick="increaseQuantity(${index})">+</button>
            </div>
            <div class="product-actions">
                <button class="btn" onclick="editProduct(${index})">تعديل</button>
                <button class="btn btn-danger" onclick="showDeleteConfirm(${index})">حذف</button>
                <button class="btn btn-warning" onclick="toggleOutOfStock(${index})">
                    ${product.isOutOfStock ? 'إعادة التوفير' : 'نفاذ الكمية'}
                </button>
            </div>
        `;
        container.appendChild(productCard);
    });
}

// زيادة الكمية
function increaseQuantity(index) {
    products[index].quantity++;
    products[index].isOutOfStock = false;
    localStorage.setItem('products', JSON.stringify(products));
    displayAdminProducts();
}

// تقليل الكمية
function decreaseQuantity(index) {
    if (products[index].quantity > 0) {
        products[index].quantity--;
        if (products[index].quantity === 0) {
            products[index].isOutOfStock = true;
        }
        localStorage.setItem('products', JSON.stringify(products));
        displayAdminProducts();
    }
}

// تحديث الكمية يدوياً
function updateQuantity(index, value) {
    const newQuantity = parseInt(value) || 0;
    products[index].quantity = newQuantity;
    products[index].isOutOfStock = (newQuantity <= 0);
    localStorage.setItem('products', JSON.stringify(products));
    displayAdminProducts();
}

// إعادة تخزين المنتج
function restockProduct(index) {
    products[index].isOutOfStock = false;
    if (products[index].quantity <= 0) {
        products[index].quantity = 1;
    }
    localStorage.setItem('products', JSON.stringify(products));
    displayAdminProducts();
}

// تبديل حالة نفاذ الكمية
function toggleOutOfStock(index) {
    products[index].isOutOfStock = !products[index].isOutOfStock;
    if (products[index].isOutOfStock) {
        products[index].quantity = 0;
    } else {
        products[index].quantity = products[index].quantity || 1;
    }
    localStorage.setItem('products', JSON.stringify(products));
    displayAdminProducts();
}

// عرض تأكيد الحذف
function showDeleteConfirm(productIndex) {
    deleteProductId = productIndex;
    document.getElementById('confirmDeleteModal').style.display = 'block';
}

// إلغاء الحذف
function cancelDelete() {
    deleteProductId = null;
    document.getElementById('confirmDeleteModal').style.display = 'none';
}

// تأكيد الحذف
function confirmDelete() {
    if (deleteProductId !== null) {
        products.splice(deleteProductId, 1);
        localStorage.setItem('products', JSON.stringify(products));
        displayAdminProducts();
        cancelDelete();
    }
}

// تحرير المنتج
function editProduct(productIndex) {
    window.location.href = `edit-product.html?action=edit&id=${productIndex}`;
}

// تحميل بيانات المنتج للتعديل
function loadProductForEdit() {
    const urlParams = new URLSearchParams(window.location.search);
    const action = urlParams.get('action');
    const productId = urlParams.get('id');
    
    const formTitle = document.getElementById('formTitle');
    const productForm = document.getElementById('productForm');
    
    if (action === 'edit' && productId) {
        formTitle.textContent = 'تعديل المنتج';
        currentProductId = parseInt(productId);
        
        const product = products[currentProductId];
        document.getElementById('productId').value = currentProductId;
        document.getElementById('productName').value = product.name;
        document.getElementById('productDescription').value = product.description;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productQuantity').value = product.quantity;
        
        const imagePreview = document.getElementById('productImagePreview');
        imagePreview.src = product.image;
        imagePreview.style.display = 'block';
        
        // تحديد طرق الدفع
        document.querySelectorAll('input[name="payment"]').forEach(checkbox => {
            checkbox.checked = product.paymentMethods.includes(checkbox.value);
        });
    } else {
        formTitle.textContent = 'إضافة منتج جديد';
    }
}

// حفظ المنتج (إضافة/تعديل)
function saveProduct(e) {
    e.preventDefault();
    
    const name = document.getElementById('productName').value;
    const description = document.getElementById('productDescription').value;
    const price = document.getElementById('productPrice').value;
    const quantity = document.getElementById('productQuantity').value;
    const imageFile = document.getElementById('productImage').files[0];
    
    // الحصول على طرق الدفع المختارة
    const paymentMethods = [];
    document.querySelectorAll('input[name="payment"]:checked').forEach(checkbox => {
        paymentMethods.push(checkbox.value);
    });
    
    if (currentProductId !== null) {
        // تعديل المنتج الموجود
        products[currentProductId].name = name;
        products[currentProductId].description = description;
        products[currentProductId].price = price;
        products[currentProductId].quantity = quantity;
        products[currentProductId].paymentMethods = paymentMethods;
        products[currentProductId].isOutOfStock = (quantity <= 0);
        
        if (imageFile) {
            const reader = new FileReader();
            reader.onload = function(e) {
                products[currentProductId].image = e.target.result;
                localStorage.setItem('products', JSON.stringify(products));
                alert('تم تعديل المنتج بنجاح!');
                window.location.href = 'admin.html';
            };
            reader.readAsDataURL(imageFile);
        } else {
            localStorage.setItem('products', JSON.stringify(products));
            alert('تم تعديل المنتج بنجاح!');
            window.location.href = 'admin.html';
        }
    } else {
        // إضافة منتج جديد
        if (!imageFile) {
            alert('يرجى اختيار صورة للمنتج');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            const newProduct = {
                id: Date.now(),
                name,
                description,
                price,
                quantity,
                image: e.target.result,
                paymentMethods,
                isOutOfStock: (quantity <= 0)
            };
            
            products.push(newProduct);
            localStorage.setItem('products', JSON.stringify(products));
            alert('تمت إضافة المنتج بنجاح!');
            window.location.href = 'admin.html';
        };
        reader.readAsDataURL(imageFile);
    }
}

// تسجيل الخروج
function logout() {
    localStorage.removeItem('isAdminLoggedIn');
    window.location.href = 'index.html';
}
