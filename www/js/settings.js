document.addEventListener("DOMContentLoaded", function () {
    const languageBtn = document.getElementById("language-btn");
    const languageDropdown = document.getElementById("language-dropdown");
    const themeBtn = document.getElementById("theme-btn");
    const themeDropdown = document.getElementById("theme-dropdown");

    function setLanguage(lang) {
        localStorage.setItem("language", lang);
        languageBtn.innerText = languageDropdown.querySelector(`[data-lang="${lang}"]`).innerText;
    }

    function setTheme(theme) {
        localStorage.setItem("theme", theme);
        themeBtn.innerText = themeDropdown.querySelector(`[data-theme="${theme}"]`).innerText;
        document.body.classList.toggle("dark-mode", theme === "dark");
    }

    languageBtn.addEventListener("click", (event) => {
        event.stopPropagation();
        languageDropdown.classList.toggle("show");
    });

    themeBtn.addEventListener("click", (event) => {
        event.stopPropagation();
        themeDropdown.classList.toggle("show");
    });

    languageDropdown.addEventListener("click", (event) => {
        if (event.target.dataset.lang) {
            setLanguage(event.target.dataset.lang);
            languageDropdown.classList.remove("show");
        }
    });

    themeDropdown.addEventListener("click", (event) => {
        if (event.target.dataset.theme) {
            setTheme(event.target.dataset.theme);
            themeDropdown.classList.remove("show");
        }
    });

    document.addEventListener("click", (event) => {
        if (!languageBtn.contains(event.target) && !languageDropdown.contains(event.target)) {
            languageDropdown.classList.remove("show");
        }
        if (!themeBtn.contains(event.target) && !themeDropdown.contains(event.target)) {
            themeDropdown.classList.remove("show");
        }
    });

    setLanguage(localStorage.getItem("language") || "uk");
    setTheme(localStorage.getItem("theme") || "light");
});
