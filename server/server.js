require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const { nanoid } = require('nanoid');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL Database Connection
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// ✅ API Test Route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// ✅ Signup Route
app.post('/signup', async (req, res) => {
  const { username, email, password, role } = req.body;
  if (!username || !email || !password || !role) {
    return res.status(400).json({ success: false, message: 'All fields are required!' });
  }

  const emailPattern = /^[a-zA-Z0-9._-]+@gmail\.com$/;
  if (!emailPattern.test(email)) {
    return res.status(400).json({ success: false, message: 'Invalid Gmail address!' });
  }

  if (password.length < 8) {
    return res.status(400).json({ success: false, message: 'Password must be at least 8 characters long!' });
  }

  try {
    const [existingUsers] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      return res.status(400).json({ success: false, message: 'Email already registered!' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query('INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)', 
      [username, email, hashedPassword, role]);

    return res.status(201).json({ success: true, message: 'User registered successfully!' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error!' });
  }
});

// ✅ Login Route
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'All fields are required!' });
  }

  try {
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid email or password!' });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password!' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return res.status(200).json({ success: true, message: 'Login successful!', user: { id: user.id, email: user.email, role: user.role }, token });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error!' });
  }
});

// 📌 Generate a Short URL
app.post('/api/shorten', async (req, res) => {
  const { longUrl, user_id } = req.body;
  if (!longUrl || !user_id) {
    return res.status(400).json({ error: 'Missing parameters' });
  }

  const shortCode = nanoid(10);
  try {
    await db.query("INSERT INTO urls (user_id, long_url, short_url, click_count) VALUES (?, ?, ?, 0)", [user_id, longUrl, shortCode]);
    res.json({
      success: true,
      message: "Short URL generated successfully!",
      longUrl: longUrl,
      shortUrl: `http://localhost:5000/${shortCode}`,
      clickCount: 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 📌 Fetch User URLs
app.get('/api/urls/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const [results] = await db.query('SELECT long_url, short_url, click_count FROM urls WHERE user_id = ?', [userId]);
    res.json({ success: true, urls: results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📌 Fetch Click Count for a Specific URL
app.get('/api/getClickCount/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [results] = await db.query('SELECT click_count FROM urls WHERE id = ?', [id]);
    if (results.length === 0) {
      return res.status(404).json({ message: 'URL not found' });
    }
    res.status(200).json({ clickCount: results[0].click_count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📌 Handle Redirection when a Short URL is Visited
app.get('/:shortCode', async (req, res) => {
  const { shortCode } = req.params;
  try {
    const [results] = await db.query('SELECT long_url FROM urls WHERE short_url = ?', [shortCode]);
    if (results.length === 0) {
      return res.status(404).json({ error: 'Short URL not found' });
    }

    await db.query('UPDATE urls SET click_count = click_count + 1 WHERE short_url = ?', [shortCode]);
    res.redirect(results[0].long_url);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.get('/api/admin/urls', async (req, res) => {
  try {
    const query = `
      SELECT 
        id, 
        user_id,
        long_url AS longUrl, 
        CONCAT('http://localhost:5000/', short_url) AS shortUrl,
        click_count AS clickCount, 
        created_at 
      FROM urls
    `;
    const [results] = await db.query(query);
    
    if (results.length === 0) {
      return res.json({ success: false, message: 'No URLs found' });
    }


    res.json({ success: true, urls: results });
  } catch (err) {
    console.error('Error fetching URLs:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch URLs' });
  }
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
