const pool = require('../config/database');

async function initializeDatabase() {
  const client = await pool.connect();
  try {
    // Create users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL,
        role VARCHAR(20) NOT NULL
      )
    `);

    // Create booking_requests table
    await client.query(`
      CREATE TABLE IF NOT EXISTS booking_requests (
        id SERIAL PRIMARY KEY,
        employee_id INTEGER REFERENCES users(id),
        booking_date DATE NOT NULL,
        status VARCHAR(20) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        manager_action_at TIMESTAMP,
        admin_action_at TIMESTAMP
      )
    `);
  } finally {
    client.release();
  }
}

module.exports = { initializeDatabase };
