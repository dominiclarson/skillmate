


import mysql from 'mysql2/promise';


const {
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
} = process.env;

if (!DB_HOST || !DB_USER || !DB_PASSWORD || !DB_NAME) {
  throw new Error('Missing one of DB_HOST, DB_USER, DB_PASSWORD, DB_NAME in environment');
}

export const pool = mysql.createPool({
  host:     DB_HOST,
  port:     Number(DB_PORT || 3306),
  user:     DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
