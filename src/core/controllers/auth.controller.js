const notNullAuth = require('../utils/auth.utils');
const db = require('../database/pool');

class AuthContoller {
    constructor() {
        db.testConnection().then(isConnected => {
            if (!isConnected) process.exit(1); 
        });
    }
    async CreateUser(name, password) {
        try {
            const newUser = await db.query(
                'INSERT INTO users(name, password) VALUES ($1, $2) RETURNING id',
                [name, password]
            );

            return {
                success: true,
                message: 'Пользователь был успешно зарегистрирован!',
                user: newUser.rows[0],
            };
        } catch (err) {
            console.error('Registration Error:', err);
            return { message: `Database error: ${err}` };
        }
    }

    async Login(name, password) {
        console.log('Попали а авторизацию')
        try {
            const result = await db.query(
                'SELECT id FROM users WHERE name = $1 AND password = $2 LIMIT 1', 
                [name, password]
            );
            
            if (result.rows.length === 0) {
                return { success: false, error: 'Неверное имя или пароль' };
            }
            
            const user_id = result.rows[0].id;
            console.log('user_id', user_id)
            return { success: true, message: 'Пользователь авторизован', user_id };
            
        } catch (err) {
            console.error('Error fetching basket items:', err);
            return { message: `Database error: ${err}` };
        }
    }
}

module.exports = new AuthContoller();