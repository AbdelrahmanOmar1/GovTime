const  { Pool }  = require('pg');
require('dotenv').config();

// connect to the database local
// const pool= new Pool({
//     host: process.env.PGHOST,
//     user : process.env.PGUSER,
//     password : process.env.PGPASSWORD,
//     database: process.env.PGDATABASE,
//     port : process.env.PGPORT,
// });


//connect to the data base online
const pool = new Pool({
  connectionString: process.env.DATABASE_URL.replace('****************' , process.env.DATABASE_URL_PASS),
  ssl: { rejectUnauthorized: false }
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
});

pool.connect()
  .then(() => console.log('Connected to DB! ✅'))
  .catch((err) => console.error('💥 Error connecting to DB:', err));



module.exports = pool;