const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// PostgreSQL connection
const pool = new Pool({
  user: 'your_username',
  host: 'localhost',
  database: 'your_database',
  password: 'your_password',
  port: 5432,
});

// Create table with SERIAL (auto-increment) primary key
async function createTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        address TEXT,
        phone VARCHAR(20),
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        qr_data TEXT
      )
    `);
    console.log('Table created or already exists');
  } catch (err) {
    console.error('Error creating table:', err);
  }
}

createTable();

// Registration endpoint
app.post('/register', async (req, res) => {
  try {
    const { name, address, phone } = req.body;
    
    // Insert into PostgreSQL and return the generated ID
    const result = await pool.query(
      `INSERT INTO users (name, address, phone, qr_data) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, name, address, phone, timestamp`,
      [
        name, 
        address, 
        phone, 
        JSON.stringify({ ...req.body, timestamp: new Date().toISOString() })
      ]
    );
    
    res.status(201).json({
      success: true,
      id: result.rows[0].id,
      data: result.rows[0]
    });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({
      success: false,
      message: 'Registration failed'
    });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});