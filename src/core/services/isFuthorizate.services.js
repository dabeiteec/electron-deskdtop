const db = require('../database/pool');

const isAuthorized = async (user_id) => {
    const isUserExists = await db.query('SELECT id FROM users WHERE id = $1 LIMIT 1', [user_id]);
    if (!isUserExists.rows.length) { return { success:false, message: 'Вы не авторизованы' }; };
    return { success: true };
};

module.exports = { isAuthorized };
