document.addEventListener("DOMContentLoaded", function() {
    const form = document.querySelector("form");

    form.addEventListener("submit", function(event) {
        event.preventDefault(); 

        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        if (!username || !password) {
            alert("Будь ласка, заповніть всі поля!");
            return;
        }

        const userData = {
            username: username,
            password: password
        };

        fetch('http://localhost:5000/register', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("Реєстрація успішна!");
                window.location.href = "categories.html"; 
            } else {
                alert("Помилка реєстрації: " + data.message);
            }
        })
        .catch(error => {
            console.error('Помилка:', error);
            alert('Сталася помилка при реєстрації');
        });
    });
});
