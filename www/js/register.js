document.addEventListener("DOMContentLoaded", function () {
    const themeToggleBtn = document.getElementById("themeToggleBtn");
    const body = document.body;

    if (localStorage.getItem("theme") === "dark") {
        body.classList.add("dark-mode");
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener("click", function () {
            body.classList.toggle("dark-mode");
            localStorage.setItem("theme", body.classList.contains("dark-mode") ? "dark" : "light");
        });
    }

    const registerForm = document.getElementById("registerForm");
    if (registerForm) {
        registerForm.addEventListener("submit", async function (e) {
            e.preventDefault();
            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;

            try {
                const response = await fetch("http://localhost:5000/register", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ username, password })
                });

                const data = await response.json();
                if (data.success) {
                    alert(data.message);
                    window.location.href = data.redirect || "/categories.html";
                } else {
                    alert(data.message);
                }
            } catch (error) {
                console.error("Помилка запиту:", error);
                alert("Сталася помилка. Спробуйте ще раз.");
            }
        });
    } else {
        console.error("Елемент з id 'registerForm' не знайдено!");
    }

    const registerBtn = document.getElementById("registerBtn");
    if (registerBtn) {
        registerBtn.addEventListener("click", function () {
            window.location.href = "register.html";
        });
    }

    const loginBtn = document.getElementById("loginBtn");
    if (loginBtn) {
        loginBtn.addEventListener("click", function () {
            window.location.href = "login.html";
        });
    }

    const continueBtn = document.getElementById("continueBtn");
    if (continueBtn) {
        continueBtn.addEventListener("click", function () {
            alert("Продовжуємо без реєстрації");
            window.location.href = "map.html";
        });
    }

    const mapBtn = document.getElementById("mapBtn");
    if (mapBtn) {
        mapBtn.addEventListener("click", function () {
            window.location.href = "map.html";
        });
    }

    window.changeLanguage = function (lang) {
        localStorage.setItem("selectedLanguage", lang);
        location.reload();
    };
});
