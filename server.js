require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const cors = require('cors');

const saltRounds = 10;
const app = express();

app.use(cors({
    origin: ['http://localhost:8000', 'http://localhost:8001'],
    methods: ['POST', 'GET'],
    credentials: true
}));

app.use(express.json());

// Налаштування підключення до PostgreSQL
const pool = new Pool({
    user: 'postgres',          
    host: 'localhost',         
    database: 'registration_db', 
    password: '1234',          
    port: 5432                
});


pool.connect()
    .then(() => console.log('✅ Підключення до бази успішне'))
    .catch(err => {
        console.error('❌ Помилка підключення до бази:', err);
        process.exit(1);
    });

// --------------------- КОРИСТУВАЧІ ---------------------
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Будь ласка, заповніть всі поля!' });
    }

    try {
        const result = await pool.query('SELECT id FROM users WHERE username = $1', [username]);
        if (result.rows.length > 0) {
            return res.status(400).json({ success: false, message: 'Це ім\'я користувача вже зайняте.' });
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const newUser = await pool.query(
            'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id',
            [username, hashedPassword]
        );

        res.status(201).json({
            success: true,
            message: '✅ Реєстрація успішна!',
            userId: newUser.rows[0].id,
            redirect: '/categories'
        });

    } catch (err) {
        console.error('❌ Помилка при реєстрації:', err);
        res.status(500).json({ success: false, message: 'Внутрішня помилка сервера' });
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Будь ласка, заповніть всі поля!' });
    }

    try {
        const result = await pool.query('SELECT id, password FROM users WHERE username = $1', [username]);
        if (result.rows.length === 0) {
            return res.status(401).json({ success: false, message: '❌ Користувача не знайдено' });
        }

        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: '❌ Невірний пароль' });
        }

        res.status(200).json({
            success: true,
            message: '✅ Вхід успішний!',
            userId: user.id,
            redirect: '/categories.html'
        });

    } catch (err) {
        console.error('❌ Помилка при вході:', err);
        res.status(500).json({ success: false, message: 'Внутрішня помилка сервера' });
    }
});

// --------------------- РЕСТОРАНИ ---------------------
app.get('/restaurants', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM restaurants');
        res.json(result.rows);
    } catch (err) {
        console.error('❌ Помилка при отриманні ресторанів:', err);
        res.status(500).json({ error: 'Помилка сервера' });
    }
});

app.post('/restaurants', async (req, res) => {
    const { name, url, description, image } = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO restaurants (name, url, description, image) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, url, description, image]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('❌ Помилка при додаванні ресторану:', err);
        res.status(500).json({ error: 'Помилка сервера' });
    }
});

app.delete('/restaurants/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM restaurants WHERE id = $1', [id]);
        res.json({ message: 'Ресторан видалено' });
    } catch (err) {
        console.error('❌ Помилка при видаленні ресторану:', err);
        res.status(500).json({ error: 'Помилка сервера' });
    }
});

// --------------------- ВІДГУКИ ---------------------

// Отримати відгуки (через ?restaurant_id=1)
app.get('/reviews', async (req, res) => {
    const { restaurant_id } = req.query;

    if (!restaurant_id) {
        return res.status(400).json({ success: false, message: 'Необхідно вказати ID ресторану.' });
    }

    try {
        const reviews = await pool.query(
            'SELECT * FROM reviews WHERE restaurant_id = $1 ORDER BY created_at DESC',
            [restaurant_id]
        );
        res.status(200).json(reviews.rows);
    } catch (err) {
        console.error('❌ Помилка при отриманні відгуків:', err);
        res.status(500).json({ success: false, message: 'Не вдалося отримати відгуки.' });
    }
});

// Оновлення середнього рейтингу в таблиці restaurants
async function updateRestaurantRating(restaurantId) {
    try {
        const result = await pool.query(
            'SELECT AVG(rating) AS average_rating FROM reviews WHERE restaurant_id = $1',
            [restaurantId]
        );
        const averageRating = result.rows[0].average_rating;

        await pool.query(
            'UPDATE restaurants SET rating = $1 WHERE id = $2',
            [averageRating, restaurantId]
        );

        console.log(`✅ Середній рейтинг ресторану ID ${restaurantId} оновлено: ${averageRating}`);
    } catch (err) {
        console.error('❌ Помилка при оновленні рейтингу ресторану:', err);
    }
}

// Модифікований POST /reviews
app.post('/reviews', async (req, res) => {
    const { restaurant_id, rating, comment, username } = req.body;

    if (!restaurant_id || !rating || !comment) {
        return res.status(400).json({ success: false, message: 'Будь ласка, заповніть всі поля!' });
    }

    try {
        await pool.query(
            'INSERT INTO reviews (restaurant_id, rating, comment, username, created_at) VALUES ($1, $2, $3, $4, NOW())',
            [restaurant_id, rating, comment, username || 'Anonymous']
        );

        // Оновлення рейтингу після додавання відгуку
        await updateRestaurantRating(restaurant_id);

        res.status(201).json({ success: true, message: '✅ Відгук додано успішно!' });
    } catch (err) {
        console.error('❌ Помилка сервера:', err);
        res.status(500).json({ success: false, message: 'Не вдалося додати відгук.' });
    }
});


// Отримання середнього рейтингу ресторану
app.get('/restaurants/:id/rating', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT rating FROM restaurants WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Ресторан не знайдено' });
        }

        res.json({ averageRating: result.rows[0].rating });
    } catch (err) {
        console.error('❌ Помилка при отриманні рейтингу ресторану:', err);
        res.status(500).json({ success: false, message: 'Помилка сервера' });
    }
});


// --------------------- LANDMARKS ---------------------
app.get('/landmarks', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM landmarks');
        res.json(result.rows);
    } catch (err) {
        console.error('❌ Помилка при отриманні пам’яток:', err);
        res.status(500).json({ error: 'Помилка сервера' });
    }
});

app.post('/landmarks', async (req, res) => {
    const { name, location, description, image } = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO landmarks (name, location, description, image) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, location, description, image]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('❌ Помилка при додаванні пам’ятки:', err);
        res.status(500).json({ error: 'Помилка сервера' });
    }
});

app.delete('/landmarks/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM landmarks WHERE id = $1', [id]);
        res.json({ message: 'Пам’ятка видалена' });
    } catch (err) {
        console.error('❌ Помилка при видаленні пам’ятки:', err);
        res.status(500).json({ error: 'Помилка сервера' });
    }
});

// --------------------- SHOPPING ---------------------
app.get('/shopping', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM shopping');
        res.json(result.rows);
    } catch (err) {
        console.error('❌ Помилка при отриманні магазинів:', err);
        res.status(500).json({ error: 'Помилка сервера' });
    }
});

app.post('/shopping', async (req, res) => {
    const { name, location, description, image } = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO shopping (name, location, description, image) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, location, description, image]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('❌ Помилка при додаванні магазину:', err);
        res.status(500).json({ error: 'Помилка сервера' });
    }
});

app.delete('/shopping/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM shopping WHERE id = $1', [id]);
        res.json({ message: 'Магазин видалено' });
    } catch (err) {
        console.error('❌ Помилка при видаленні магазину:', err);
        res.status(500).json({ error: 'Помилка сервера' });
    }
});

// --------------------- ЗАПУСК СЕРВЕРА ---------------------
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`🚀 Сервер запущено на порту ${PORT}`);
});