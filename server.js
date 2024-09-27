const express = require('express');
const path = require('path');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// PostgreSQL connection
const pool = new Pool({
    user: 'postgres',  // Replace with your PostgreSQL user
    host: 'localhost',
    database: 'postgres',  // Replace with your database name
    password: 'admin',  // Replace with your password
    port: 5432,
});

app.use(cors());
app.use(bodyParser.json());

// Serve static files from the root, lib, and images directories
app.use(express.static(path.join(__dirname))); // This serves files from the root
app.use('/lib', express.static(path.join(__dirname, 'lib'))); // This serves files from lib
app.use('/images', express.static(path.join(__dirname, 'images'))); // This serves files from images

// Serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Registration endpoint
app.post('/register', async (req, res) => {
    const { email, password } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert into database
    try {
        const result = await pool.query(
            'INSERT INTO usersLogin (email, password) VALUES ($1, $2) RETURNING *',
            [email, hashedPassword]
        );
        res.status(201).json({ message: 'User registered successfully', user: result.rows[0] });
    } catch (err) {
        // Handle specific error cases
        if (err.code === '23505') { // Unique violation
            res.status(409).json({ error: 'Email already exists' });
        } else {
            res.status(500).json({ error: err.message });
        }
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
