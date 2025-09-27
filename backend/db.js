// db.js
require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  // For cloud PostgreSQL (e.g., Heroku), uncomment:
  // connectionString: process.env.DATABASE_URL,
  // ssl: { rejectUnauthorized: false },
});

// Test connection
pool
  .connect()
  .then((client) => {
    console.log("Connected to PostgreSQL successfully!");
    client.release();
  })
  .catch((err) => console.error("Database connection error:", err.stack));

module.exports = pool;
