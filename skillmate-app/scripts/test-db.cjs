



import 'dotenv/config';
import { pool } from '../lib/db';   

(async () => {
  try {
    const [rows] = await pool.query('SELECT NOW() AS now');
    console.log('DB is reachable, server time is:', rows);
  } catch (err) {
    console.error('❌ Unable to connect to DB:', err);
  } finally {
    await pool.end();
  }
})();