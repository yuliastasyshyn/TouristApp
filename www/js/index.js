document.addEventListener("DOMContentLoaded", function () {
    const themeToggleBtn = document.getElementById("themeToggleBtn");
    const body = document.body;

    // Перевіряємо, чи є збережене значення в localStorage
    if (localStorage.getItem("theme") === "dark") {
        body.classList.add("dark-mode");
    }

    themeToggleBtn.addEventListener("click", function () {
        body.classList.toggle("dark-mode");

        // Зберігаємо вибір теми в localStorage
        if (body.classList.contains("dark-mode")) {
            localStorage.setItem("theme", "dark");
        } else {
            localStorage.setItem("theme", "light");
        }
    });
});

// Логіка кнопок
document.getElementById('registerBtn').addEventListener('click', function() {
    window.location.href = 'register.html';
});

document.getElementById('loginBtn').addEventListener('click', function() {
    window.location.href = 'login.html';
});

document.getElementById('continueBtn').addEventListener('click', function() {
    alert('Продовжуємо без реєстрації');
    window.location.href = 'map.html';
});

document.getElementById('mapBtn').addEventListener('click', function() {
    window.location.href = 'map.html';
});

function changeLanguage(lang) {
    localStorage.setItem('selectedLanguage', lang);
    location.reload();
}
