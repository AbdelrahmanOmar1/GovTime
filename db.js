const  { Pool }  = require('pg');
require('dotenv').config();


// connect to the database
const pool= new Pool({
    host: process.env.PGHOST,
    user : process.env.PGUSER,
    password : process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    port : process.env.PGPORT,
});
pool.connect()
  .then(() => console.log('Connected to DB! ✅'))
  .catch((err) => console.error('💥 Error connecting to DB:', err));



module.exports = pool;