document.getElementById('reviewForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = document.getElementById('username').value.trim();
    const rating = parseInt(document.getElementById('rating').value);
    const comment = document.getElementById('comment').value.trim();
    const restaurantId = new URLSearchParams(window.location.search).get('restaurant_id');

    console.log("Дані форми:", { username, rating, comment, restaurantId });

    if (!username || !rating || !comment) {
        alert('Будь ласка, заповніть всі поля.');
        return;
    }

    console.log("Дані, що відправляються:", { restaurantId, rating, comment, username });

    try {
        const response = await fetch('http://localhost:5000/reviews', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, rating, comment, restaurant_id: restaurantId })
        });

        console.log("Відповідь сервера:", response);

        if (response.ok) {
            alert('Відгук додано!');
            document.getElementById('reviewForm').reset();
            fetchReviews();
        } else {
            const errorText = await response.text();
            console.error('Помилка сервера:', errorText);
            alert('Помилка при додаванні відгуку.');
        }
    } catch (error) {
        console.error('Помилка запиту:', error);
        alert('Сталася помилка при відправленні відгуку.');
    }
});

async function fetchReviews() {
    const restaurantId = new URLSearchParams(window.location.search).get('restaurant_id');
    console.log("Завантажуємо відгуки для ресторану з ID:", restaurantId);

    try {
        const response = await fetch(`http://localhost:5000/reviews?restaurant_id=${restaurantId}`);
        console.log("Відповідь сервера (отримання відгуків):", response);

        if (!response.ok) {
            console.error('Помилка отримання відгуків:', await response.text());
            return;
        }

        const reviews = await response.json();
        console.log("Отримані відгуки:", reviews);

        const container = document.getElementById('reviewsContainer');
        container.innerHTML = '';

        if (reviews.length === 0) {
            container.innerHTML = '<p>Поки що немає відгуків.</p>';
            return;
        }

        reviews.forEach(review => {
            const reviewElement = document.createElement('div');
            reviewElement.classList.add('review');
            reviewElement.innerHTML = `
                <strong>${review.username}</strong> (${review.rating}/5)
                <p>${review.comment}</p>
            `;
            container.appendChild(reviewElement);
        });

    } catch (error) {
        console.error('Помилка при отриманні відгуків:', error);
    }
}

fetchReviews();
