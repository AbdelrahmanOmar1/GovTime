const { Pool } = require("pg");
const chalk = require("chalk");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.MONGO_URI,
  ssl: { rejectUnauthorized: false },
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
});

pool
  .connect()
  .then(() =>
    console.log(chalk.cyan("✅ Connected to the database successfully.")),
  )
  .catch((err) => console.error("💥 Error connecting to DB:", err));

module.exports = pool;
