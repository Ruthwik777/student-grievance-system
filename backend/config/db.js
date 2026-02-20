const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'Msdhoni@7', 
  database: process.env.DB_NAME || 'grievance_system',
});

module.exports = pool;
