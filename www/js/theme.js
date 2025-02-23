document.addEventListener("DOMContentLoaded", function () {
    const themeToggle = document.getElementById("theme-toggle");

    function applyTheme() {
        if (localStorage.getItem("theme") === "dark") {
            document.body.classList.add("dark-mode");
            if (themeToggle) themeToggle.textContent = "☀️";
        } else {
            document.body.classList.remove("dark-mode");
            if (themeToggle) themeToggle.textContent = "🌙";
        }
    }

    applyTheme();

    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            if (document.body.classList.contains("dark-mode")) {
                localStorage.setItem("theme", "light");
            } else {
                localStorage.setItem("theme", "dark");
            }
            applyTheme();
        });
    }

    const leafletContainer = document.querySelector(".leaflet-container");
    if (leafletContainer) leafletContainer.style.background = "#fff";
});
