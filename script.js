// بيانات الدخول (يمكنك تعديلها مباشرة هنا)
const adminCredentials = {
    username: "AdminTechno",  // غير هذا الاسم كما تريد
    password: "Techno@2024"   // غير هذه الكلمة كما تريد
};

// نظام تسجيل الدخول
document.addEventListener('DOMContentLoaded', function() {
    // تسجيل الدخول
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            if (username === adminCredentials.username && password === adminCredentials.password) {
                localStorage.setItem('isAdminLoggedIn', 'true');
                window.location.href = 'admin.html';
            } else {
                const errorElement = document.getElementById('loginError');
                errorElement.textContent = 'خطأ: اسم المستخدم أو كلمة المرور غير صحيحة';
                errorElement.style.display = 'block';
            }
        });
    }

    // التحقق من التسجيل قبل الدخول للوحة التحكم
    const adminPages = ['admin.html', 'edit-product.html'];
    if (adminPages.some(page => window.location.pathname.includes(page))) {
        if (!localStorage.getItem('isAdminLoggedIn')) {
            window.location.href = 'login.html';
        }
    }
});

// وظيفة تسجيل الخروج (تُستخدم في لوحة التحكم)
function logout() {
    localStorage.removeItem('isAdminLoggedIn');
    window.location.href = 'login.html';
}
