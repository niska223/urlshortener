const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');  // MySQL connection
const router = express.Router();

// Register route
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
    db.query(query, [name, email, hashedPassword], (err, result) => {
        if (err) return res.status(400).json({ message: 'Error registering user' });
        res.status(200).json({ message: 'User registered successfully' });
    });
});

// Login route
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], async (err, result) => {
        if (err || result.length === 0) return res.status(400).json({ message: 'User not found' });

        const user = result[0];
        const match = await bcrypt.compare(password, user.password);

        if (!match) return res.status(400).json({ message: 'Incorrect password' });

        const token = jwt.sign({ userId: user.id }, 'your_jwt_secret', { expiresIn: '1h' });
        res.status(200).json({ token });
    });
});

module.exports = router;
