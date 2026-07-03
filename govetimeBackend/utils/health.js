// utils/health.js
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const os = require('os');
const process = require('process');
const { Pool } = require('pg');
const chalk = require('chalk');

// PostgreSQL pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL.replace("****************" , process.env.DATABASE_URL_PASS),
  ssl: { rejectUnauthorized: false }
});

// Helper to format bytes
const toMB = (bytes) => (bytes / 1024 / 1024).toFixed(2) + ' MB';

// Function to check DB connection
async function checkDB() {
  try {
    await pool.query('SELECT NOW()');
    return chalk.green('connected ✅');
  } catch (err) {
    return chalk.red('failed ❌');
  }
}

// Function to show health stats
async function showHealth() {
  console.clear();
  console.log(chalk.blueBright('=============================='));
  console.log(chalk.yellow.bold('     🩺 GOVTIME HEALTH CHECK'));
  console.log(chalk.blueBright('=============================='));

  // Node process stats
  console.log(chalk.cyan(`🕐 Uptime:`), chalk.white(`${(process.uptime() / 60).toFixed(2)} minutes`));
  
  const memoryUsage = process.memoryUsage();
  console.log(chalk.cyan(`🧠 Memory Usage:`), 
    `RSS: ${chalk.green(toMB(memoryUsage.rss))}, HeapUsed: ${chalk.magenta(toMB(memoryUsage.heapUsed))}, HeapTotal: ${chalk.yellow(toMB(memoryUsage.heapTotal))}`
  );

  // CPU stats
  const cpus = os.cpus();
  console.log(chalk.cyan(`⚙️ CPU:`), 
    `${chalk.white(cpus[0].model)}, Cores: ${chalk.green(cpus.length)}, Load Avg: ${chalk.yellow(os.loadavg().map(n => n.toFixed(2)).join(', '))}`
  );

  // System memory
  console.log(chalk.cyan(`💽 Memory:`), 
    `Total: ${chalk.green(toMB(os.totalmem()))}, Free: ${chalk.magenta(toMB(os.freemem()))}`
  );

  // Node & OS info
  console.log(chalk.cyan(`🌐 Platform:`), `${chalk.white(os.platform())} | Arch: ${chalk.white(os.arch())} | Node: ${chalk.green(process.version)}`);

  // PostgreSQL connection status
  const dbStatus = await checkDB();
  console.log(chalk.cyan(`🗄️ Database:`), dbStatus);

  console.log(chalk.blueBright('==============================\n'));
}

// Update every 3 seconds
setInterval(showHealth, 3000);
