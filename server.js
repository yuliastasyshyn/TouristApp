const { Pool } = require('pg'); 
const express = require('express');
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

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'registration_db', 
    password: '1234', 
    port: 5432, 
});


pool.connect()
    .then(() => console.log('✅ Підключення до бази успішне'))
    .catch(err => {
        console.error('❌ Помилка підключення до бази:', err);
        process.exit(1); 
    });
    app.post('/register', async (req, res) => {
        const { username, password } = req.body;
    
        if (!username || !password) {
            return res.status(400).json({ success: false, message: 'Будь ласка, заповніть всі поля!' });
        }
    
        try {
            console.log("🔍 Перевіряємо користувача:", username);
            const result = await pool.query('SELECT id FROM users WHERE username = $1', [username]);
    
            if (result.rows.length > 0) {
                return res.status(400).json({ success: false, message: 'Це ім\'я користувача вже зайняте.' });
            }
    
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            const newUser = await pool.query(
                'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id',
                [username, hashedPassword]
            );
    
            return res.status(201).json({
                success: true,
                message: '✅ Реєстрація успішна!',
                userId: newUser.rows[0].id,
                redirect: '/categories' // Додаємо URL для редиректу
            });
    
        } catch (err) {
            console.error('❌ Помилка при реєстрації:', err);
            return res.status(500).json({ success: false, message: 'Внутрішня помилка сервера' });
        }
    });
    
    app.post('/login', async (req, res) => {
        const { username, password } = req.body;
    
        if (!username || !password) {
            return res.status(400).json({ success: false, message: 'Будь ласка, заповніть всі поля!' });
        }
    
        try {
            // Перевіряємо, чи є користувач у базі
            const result = await pool.query('SELECT id, password FROM users WHERE username = $1', [username]);
    
            if (result.rows.length === 0) {
                return res.status(401).json({ success: false, message: '❌ Користувача не знайдено' });
            }
    
            const user = result.rows[0];
    
            // Перевіряємо правильність пароля
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ success: false, message: '❌ Невірний пароль' });
            }
    
            // Відправляємо відповідь з редіректом на categories.html
            return res.status(200).json({
                success: true,
                message: '✅ Вхід успішний!',
                userId: user.id,
                redirect: '/categories.html' // Шлях для редіректу
            });
    
        } catch (err) {
            console.error('❌ Помилка при вході:', err);
            return res.status(500).json({ success: false, message: 'Внутрішня помилка сервера' });
        }
    });
    

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`🚀 Сервер працює на порту ${PORT}`);
});

