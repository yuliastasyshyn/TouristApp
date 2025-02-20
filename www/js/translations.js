document.addEventListener("DOMContentLoaded", function () {
    const translations = {
        en: {
            // index
            title: "Hidden Lion",
            subtitle: "Your guide to exploring the city",
            greeting: "Welcome to your personal guide!",  
            register: "Register",
            login: "Login",
            continueWithoutRegistration: "Continue without registration",
            viewMap: "View Map",
            searchPlaceholder: "Search for attractions",
            landmarks: "Landmarks",
            restaurants: "Restaurants",
            shopping: "Shopping",

            // login
            username: "Username",
            password: "Password",
            loginBtn: "Login",
            registerLink: "Don't have an account? Register",

            // register
            registerTitle: "Register",
            registerBtn: "Register",
            loginLink: "Already have an account? Login",
            loginText: "Login"
        },
        uk: {
            // index
            title: "Hidden Lion",
            subtitle: "Ваш гід по місту Львів",
            greeting: "Вас вітає Ваш персональний гід!",  
            register: "Зареєструватися",
            login: "Увійти",
            continueWithoutRegistration: "Продовжити без реєстрації",
            viewMap: "Переглянути карту",
            searchPlaceholder: "Пошук",
            landmarks: "Пам'ятки",
            restaurants: "Ресторани",
            shopping: "Шопінг",

            // login
            username: "Ім'я користувача",
            password: "Пароль",
            loginBtn: "Увійти",
            registerLink: "Ще не маєте акаунта? Зареєструватися",

            // register
            registerTitle: "Реєстрація",
            registerBtn: "Зареєструватися",
            loginLink: "Вже маєте акаунт? Увійти",
            loginText: "Увійти"
        }
    };

    function applyTranslations(lang) {
        document.title = translations[lang].title;

        if (document.getElementById("title")) {
            document.getElementById("title").innerText = translations[lang].title;
        }
        if (document.getElementById("subtitle")) {
            document.getElementById("subtitle").innerText = translations[lang].subtitle;
        }
        if (document.getElementById("search")) {
            document.getElementById("search").placeholder = translations[lang].searchPlaceholder;
        }
        if (document.getElementById("landmarks-text")) {
            document.getElementById("landmarks-text").innerText = translations[lang].landmarks;
        }
        if (document.getElementById("restaurants-text")) {
            document.getElementById("restaurants-text").innerText = translations[lang].restaurants;
        }
        if (document.getElementById("shopping-text")) {
            document.getElementById("shopping-text").innerText = translations[lang].shopping;
        }

        if (document.querySelector("header p")) {
            document.querySelector("header p").innerText = translations[lang].greeting;
        }
        if (document.getElementById("registerBtn")) {
            document.getElementById("registerBtn").innerText = translations[lang].register;
        }
        if (document.getElementById("loginBtn")) {
            document.getElementById("loginBtn").innerText = translations[lang].login;
        }
        if (document.getElementById("continueBtn")) {
            document.getElementById("continueBtn").innerText = translations[lang].continueWithoutRegistration;
        }
        if (document.getElementById("mapBtn")) {
            document.getElementById("mapBtn").innerText = translations[lang].viewMap;
        }
        if (document.getElementById("label-username")) {
            document.getElementById("label-username").innerText = translations[lang].username;
        }
        if (document.getElementById("label-password")) {
            document.getElementById("label-password").innerText = translations[lang].password;
        }
        if (document.getElementById("btn-login")) {
            document.getElementById("btn-login").innerText = translations[lang].loginBtn;
        }
        if (document.getElementById("register-link")) {
            document.getElementById("register-link").innerText = translations[lang].registerLink;
        }
        if (document.getElementById("register-title")) {
            document.getElementById("register-title").innerText = translations[lang].registerTitle;
        }
        if (document.getElementById("registerBtn")) {
            document.getElementById("registerBtn").innerText = translations[lang].registerBtn;
        }
        if (document.getElementById("login-link")) {
            document.getElementById("login-link").innerText = translations[lang].loginLink;    
        }
    }

    // Встановлюємо мову при завантаженні сторінки
    const savedLanguage = localStorage.getItem("language") || "uk";  
    applyTranslations(savedLanguage);

    window.changeLanguage = function(lang) {
        localStorage.setItem("language", lang);  
        applyTranslations(lang);  
    };
});
