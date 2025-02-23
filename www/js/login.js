document.addEventListener("DOMContentLoaded", function() { 
    const form = document.querySelector("form");

    form.addEventListener("submit", async function(event) {
        event.preventDefault(); 

        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        if (!username || !password) {
            alert("Будь ласка, заповніть всі поля!");
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/login', { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();
            console.log("📥 Отримана відповідь від сервера:", data);

            if (data.success) {
                alert("✅ Вхід успішний! Перенаправляємо...");
                setTimeout(() => {
                    
                    window.location.href = data.redirect;
                }, 1000);
            } else {
                alert("❌ Помилка входу: " + data.message);
            }
        } catch (error) {
            console.error("❌ Помилка під час запиту:", error);
            alert("Сталася помилка при вході.");
        }
    });
});
