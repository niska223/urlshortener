require('dotenv').config();
const express = require('express');
const mysql = require('mysql2'); // Using mysql2 for promises
const bcrypt = require('bcryptjs');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken'); // Add JWT for token generation

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Enable CORS for frontend communication
app.use(bodyParser.json()); // Parse JSON requests

// MySQL Database Connection
const db = mysql.createPool({
  host: 'localhost',
  user: 'root', // Change to your MySQL username
  password: '2001', // Change to your MySQL password
  database: 'url_shortener_db', // Change to your actual database name
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
}).promise();

db.getConnection()
  .then(() => console.log('Connected to MySQL Database'))
  .catch(err => console.error('Database connection failed:', err));

// ✅ API Test Route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// ✅ Signup Route
app.post('/signup', async (req, res) => {
  const { username, email, password, role } = req.body;

  console.log('Received data:', req.body); // Debugging log

  // Input validation
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
    // ✅ Check if the email already exists
    const [existingUsers] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

    if (existingUsers.length > 0) {
      return res.status(400).json({ success: false, message: 'Email already registered! Try another one.' });
    }

    // ✅ Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Insert new user into database
    const [result] = await db.query(
      'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)', 
      [username, email, hashedPassword, role]
    );

    console.log('User added:', result);

    // ✅ Ensure frontend gets a success response
    return res.status(201).json({ success: true, message: 'User registered successfully!' });

  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ success: false, message: 'Server error! Please try again later.' });
  }
});

// ✅ Login Route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  console.log('Received login data:', req.body); // Debugging log

  // Input validation
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Both email and password are required!' });
  }

  try {
    // ✅ Check if user exists
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

    if (users.length === 0) {
      return res.status(400).json({ success: false, message: 'User not found! Please check your email and try again.' });
    }

    // ✅ Compare password with hashed password
    const isPasswordCorrect = await bcrypt.compare(password, users[0].password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ success: false, message: 'Incorrect password! Please try again.' });
    }

    // ✅ Create JWT token
    const token = jwt.sign(
      { id: users[0].id, username: users[0].username, role: users[0].role }, // Payload
      process.env.JWT_SECRET, // Secret key from .env file
      { expiresIn: '1h' } // Token expires in 1 hour
    );

    // ✅ Send success response with token
    return res.status(200).json({ success: true, message: 'Login successful!', token });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Server error! Please try again later.' });
  }
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
