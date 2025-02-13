const express = require('express');
const shortid = require('shortid');
const db = require('../config/db');  // MySQL connection
const router = express.Router();

// Shorten URL route
router.post('/shorten', (req, res) => {
    const { original_url, user_id } = req.body;
    const short_url = shortid.generate();  // Generate short URL

    const query = 'INSERT INTO urls (original_url, short_url, user_id) VALUES (?, ?, ?)';
    db.query(query, [original_url, short_url, user_id], (err, result) => {
        if (err) return res.status(400).json({ message: 'Error shortening URL' });
        res.status(200).json({ short_url });
    });
});

// Redirect to original URL
router.get('/:short_url', (req, res) => {
    const { short_url } = req.params;

    const query = 'SELECT * FROM urls WHERE short_url = ?';
    db.query(query, [short_url], (err, result) => {
        if (err || result.length === 0) return res.status(404).json({ message: 'URL not found' });
        
        res.redirect(result[0].original_url);
    });
});

module.exports = router;
