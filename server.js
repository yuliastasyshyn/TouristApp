const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');


const pool = new Pool({
    user: 'newuser',
    host: 'localhost',
    database: 'registration_db', 
    password: 'newpassword', 
    port: 5432, 
});


const app = express();
app.use(bodyParser.json());

app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Будь ласка, заповніть всі поля!' });
    }

    try {
    
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        
        if (result.rows.length > 0) {
            return res.status(400).json({ success: false, message: 'Це ім\'я користувача вже зайняте.' });
        }

        
        const newUser = await pool.query(
            'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id',
            [username, password]
        );

        return res.status(200).json({
            success: true,
            message: 'Реєстрація успішна',
            userId: newUser.rows[0].id,
        });
    } catch (err) {
        console.error('Помилка при реєстрації:', err);
        return res.status(500).json({ success: false, message: 'Сталася помилка при реєстрації' });
    }
});


const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Сервер працює на порту ${PORT}`);
});
