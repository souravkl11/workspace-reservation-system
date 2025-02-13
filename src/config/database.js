const { Pool } = require('pg');

// Move these into env vars in production

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'workspace_db',
  password: '123',
  port: 5432,
});

module.exports = pool;
