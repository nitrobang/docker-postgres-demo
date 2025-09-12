const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const { createClient } = require('redis');

const app = express();
app.use(cors());
app.use(express.json()); // parse JSON bodies

// Postgres pool (reads env vars provided by docker-compose)
const pool = new Pool({
  host: process.env.DB_HOST || 'postgres',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'pass123',
  database: process.env.DB_NAME || 'testdb',
});

// Redis client (v4)
const redisUrl = `redis://${process.env.REDIS_HOST || 'redis'}:6379`;
const redisClient = createClient({ url: redisUrl });

redisClient.on('error', (err) => console.error('Redis Client Error', err));

(async () => {
  try {
    await redisClient.connect();
    console.log('✅ Connected to Redis');
  } catch (err) {
    console.error('Failed connecting to Redis:', err);
  }
})();

app.use((req, res, next) => {
  console.log('>>', req.method, req.originalUrl);
  next();
});


// GET /users - with Redis caching
app.get('/users', async (req, res) => {
  try {
    // 1) check cache
    const cache = await redisClient.get('users');
    if (cache) {
      console.log('📦 Serving /users from Redis cache');
      return res.json(JSON.parse(cache));
    }

    // 2) not cached -> query DB
    const result = await pool.query('SELECT * FROM users ORDER BY id');
    const rows = result.rows;

    // 3) cache result for 60 seconds
    await redisClient.setEx('users', 60, JSON.stringify(rows));
    console.log('💾 Fetched /users from Postgres and cached in Redis');

    res.json(rows);
  } catch (err) {
    console.error('Error GET /users:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /users - insert and invalidate cache
app.post('/users', async (req, res) => {
  console.log(">> POST /users body:", req.body);
  const { name } = req.body;
  if (!name || !String(name).trim()) {
    return res.status(400).json({ error: 'Name is required' });
  }

  try {
    // insert
    const insert = await pool.query(
      'INSERT INTO users (name) VALUES ($1) RETURNING *',
      [name.trim()]
    );
    const newUser = insert.rows[0];

    // invalidate cache so next GET will return fresh results
    try {
      await redisClient.del('users');
      console.log('🗑️  Cleared users cache after insert');
    } catch (cacheErr) {
      console.warn('Warning: failed to clear users cache:', cacheErr);
    }

    res.status(201).json(newUser);
  } catch (err) {
    console.error('Error POST /users:', err);
    res.status(500).json({ error: 'Failed to insert user' });
  }
});

// optional health route
app.get('/health', (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 5000;
// listen on 0.0.0.0 so Docker can expose it
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend running on port ${PORT}`);
});
