const db = require('./db');

async function getUserID(usrID){
    try{
        const[rows] = await db.execute('SELECT * FROM user WHERE id = ?', [usrID]);
        return rows[0];
    } catch (err) {
        console.error('Database error:', err);
        throw err;
    }
}
