// server.js
const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// PostgreSQL connection
const pool = new Pool({
    user: 'your_db_user',
    host: 'localhost',
    database: 'your_db_name',
    password: 'admin',
    port: 5432,
});

app.use(cors());
app.use(bodyParser.json());

// Registration endpoint
app.post('/register', async (req, res) => {
    const { email, password } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert into database
    try {
        const result = await pool.query(
            'INSERT INTO usersLogins (email, password) VALUES ($1, $2) RETURNING *',
            [email, hashedPassword]
        );
        res.status(201).json({ message: 'User registered successfully', user: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
