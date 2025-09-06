const express = require('express');
const { Pool } = require('pg');
const cors = require("cors"); 

console.log("🚀 Backend serverdf ");


const app = express();
app.use(cors());
app.use(express.json()); // 👈 so we can read JSON request bodies

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

// Get all users
app.get('/users', async (req, res) => {
  const result = await pool.query('SELECT * FROM users');
  res.json(result.rows);
});

// Add a new user
app.post('/users', async (req, res) => {
  const { name } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ error: "Name is required" });
  }

  try {
    const result = await pool.query(
      'INSERT INTO users (name) VALUES ($1) RETURNING *',
      [name]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error inserting user:", err);
    res.status(500).json({ error: "Failed to insert user" });
  }
});

app.listen(5000, () => console.log('Backend running on port 5000'));
