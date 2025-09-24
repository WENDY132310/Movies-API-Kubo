const mysql = require('mysql2/promise');

const config = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'admin123',
  database: process.env.DB_NAME || 'movies_kubo',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: '+00:00'
  
};

// Para Heroku con JawsDB
if (process.env.JAWSDB_URL) {
  const url = require('url');
  const dbUrl = url.parse(process.env.JAWSDB_URL);
  
  config.host = dbUrl.hostname;
  config.user = dbUrl.auth.split(':')[0];
  config.password = dbUrl.auth.split(':')[1];
  config.database = dbUrl.pathname.slice(1);
  config.port = dbUrl.port;
}

const pool = mysql.createPool(config);

// Test connection
pool.getConnection()
  .then(connection => {
    console.log('Database connected successfully');
    connection.release();
  })
  .catch(error => {
    console.error('Database connection failed:', error);
  });

module.exports = pool;