const mysql = require('mysql2');

// Database connection
const db = mysql.createConnection({
    host:'localhost',
    user:'root',  // Use your MySQL username
    password:'2001',  // Use your MySQL password
    database:'url_shortener_db'  // Use your DB name
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL database!');
});

module.exports = db;
