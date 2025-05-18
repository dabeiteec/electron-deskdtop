const db = require('../database/pool');
const { isAuthorized } = require('../services/isFuthorizate.services');

class UserController {
    async GetAllClients() {
        try{
            const response = await db.query('SELECT id,name,address FROM clients');

            if (!response.rows.length) {
                return { success:false,message: 'Не удалось получить список клиентов' };
            };
            return {success:true,users:response.rows};

        }catch(err){
            console.error('Ошибка получения клиентов:', err);
            return{ message: `Ошибка получения клиентов: ${err}` };
        }
    };

    async CreateClient(user_id,name,address,phone) {
        try{
            const balance = 0;

            if (!name || !address || !phone) {
                return { success:false,massage: 'Все поля обязательны к заполнению' };
            };
            
            const auth = await isAuthorized(user_id);
            if (!auth.success) {
                return auth; 
            };

            const response = await db.query(
                'INSERT INTO clients (name, address, phone,balance, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
                [name, address, phone, balance, user_id]
            );
            return {success:true,
                message: 'Клиент успешно создан!',
                client: response.rows[0],
            };
        }catch(err){
            console.error('Ошибка создания клиента:', err);
            return{ message: `Ошибка создания клиента: ${err}` };
        }
    };
    async GetClientInfo(id) {
        try{
            const response = await db.query('SELECT * FROM clients WHERE id = $1 LIMIT 1', [id]);
    
            if (!response.rows.length) {
                return { success:false, message: 'Клиент не найден' };
            };
    
            return {success:true, user:response.rows[0]};
        }catch(err){
            return{ success:false, error: `Ошибка получения клиента: ${err}` };
        }
    };

    async ChangeBalance(user_id,id, balance) {
        try{
            const auth = await isAuthorized(user_id);
            if (!auth.success) {
                return auth; 
            };

            const response = await db.query(
                'UPDATE clients SET balance = balance + $1 WHERE id = $2 RETURNING *',
                [balance, id]
            );

            if (!response.rows.length) {
                return { success:false, message: 'Клиент не найден' };
            };
    
            return {success:true, user:response.rows[0]};
    
        } catch(err){
        return{ success:false, error: `Ошибка изменения баланса клиента: ${err}`};
        }
    };

    async SubscribeClient(user_id,client_id, service_id) {
        try {
            const auth = await isAuthorized(user_id);
            if (!auth.success) {
                return auth; 
            };
            // Получаем тип услуги по ID компании
            const serviceTypeResult = await db.query(
                'SELECT service FROM company WHERE id = $1',
                [service_id]
            );
    
            if (!serviceTypeResult.rows.length) {
                return { success: false, message: 'Компания не найдена' };
            }
    
            const serviceType = serviceTypeResult.rows[0].service;
    
            // Проверка, подписан ли уже клиент на такую услугу
            const existing = await db.query(
                `SELECT * FROM subscribe s
                JOIN company c ON s.service_id = c.id
                WHERE s.client_id = $1 AND c.service = $2`,
                [client_id, serviceType]
            );
    
            if (existing.rows.length > 0) {
                return {
                    success: false,
                    message: `Клиент уже подписан на услугу типа ${serviceType}`
                };
            }
    
            // Вставка подписки
            const response = await db.query(
                `INSERT INTO subscribe (user_id, client_id, service_id)
                VALUES ($1, $2, $3)
                 RETURNING *`,
                [user_id,client_id, service_id]
            );
    
            return {
                success: true,
                message: 'Подписка успешно создана!',
                subscription: response.rows[0],
            };
        } catch (err) {
            console.error('Ошибка подписки клиента:', err);
            return { success: false, message: `Ошибка: ${err}` };
        }
    };
    
    async UnsubscribeClient(user_id,client_id, service_id) {
        try {
            const auth = await isAuthorized(user_id);
            if (!auth.success) {
                return auth; 
            };

            const idDebt = await db.query('SELECT debt FROM subscribe WHERE client_id = $1 AND service_id = $2 LIMIT 1', [client_id, service_id]);
            
            if (!idDebt.rows.length) {
                return { success: false, message: 'Клиент не подписан на эту услугу.' };
            }

            const debt = parseFloat(idDebt.rows[0].debt) || 0;
        
              // если долг > 0
            if (debt > 0) {
                return { success: false, message: 'У клиента есть задолженность по этой услуге!' };
            }
            const response = await db.query(
                'DELETE FROM subscribe WHERE client_id = $1 AND service_id = $2 RETURNING *',
                [client_id, service_id]
            );
    
            return {
                success: true,
                message: 'Подписка успешно удалена!',
                subscription: response.rows[0],
            };
        } catch (err) {
            console.error('Ошибка отписки клиента:', err);
            return { success: false, message: `Ошибка отписки клиента: ${err}` };
        }
    };
    
    async GetClientSubscriptions(client_id) {
        try {
            const response = await db.query(
                `SELECT 
                    c.id, 
                    c.name, 
                    c.service, 
                    c.price,
                    s.last_meter_value,
                    s.payment_date,
                    s.debt
                FROM subscribe s
                JOIN company c ON s.service_id = c.id
                WHERE s.client_id = $1`,
                [client_id]
            );
    
            if (!response.rows.length) {
                return { success: false, subscriptions: [] };
            }
            
            return { 
                success: true, 
                subscriptions: response.rows 
            };
        } catch (err) {
            console.error('Ошибка получения подписок клиента:', err);
            return { 
                success: false, 
                message: `Ошибка получения подписок клиента: ${err.message}` 
            };
        }
    };

    async UpdateMeterValue(user_id,client_id, service_id, meter_value) {
        try{
            console.log(client_id, service_id,meter_value)
            
            const auth = await isAuthorized(user_id);
            if (!auth.success) {
                return auth; 
            };
            const response = await db.query(
                `UPDATE subscribe 
                SET last_meter_value = $1, payment_date = NOW() 
                WHERE client_id = $2 AND service_id = $3 RETURNING *`,
                [meter_value, client_id, service_id]
            );
    
            if (!response.rows.length) {
                return { success: false, message: 'Не удалось обновить показания счетчика' };
            }
    
            return { success: true, message: 'Показания счетчика успешно обновлены!' };
        }catch(err){
            console.error('Ошибка обновления показаний счетчика:', err);
            return { success: false, message: `Ошибка обновления показаний счетчика: ${err}` };
        }
    };

    async UpdateDebt(user_id, client_id, service_id, debt) {
        try{
            console.log(client_id, service_id,debt)
            const auth = await isAuthorized(user_id);
            if (!auth.success) {
                return auth; 
            };

            const response = await db.query(
                `UPDATE subscribe 
                SET debt = $1 
                WHERE client_id = $2 AND service_id = $3 RETURNING *`,
                [debt, client_id, service_id]
            );
    
            if (!response.rows.length) {
                return { success: false, message: 'Не удалось обновить задолженность' };
            }
    
            return { success: true, message: 'Задолженность успешно обновлена!' };
        }catch(err){
            console.error('Ошибка обновления задолженности:', err);
            return { success: false, message: `Ошибка обновления задолженности: ${err}` };
        }
    };

    async Payment(user_id, client_id, service_id, newBalance, newDebt) {
        const auth = await isAuthorized(user_id);
        if (!auth.success) {
            return auth; 
        };
        try {
            const updateBalance = await db.query(
                `UPDATE clients SET balance = $1 WHERE id = $2 RETURNING *`,
                [newBalance, client_id]
            );
    
            if (!updateBalance.rows.length) {
                return { success: false, message: 'Не удалось обновить баланс клиента' };
            }
    
            const updateDebt = await db.query(
                `UPDATE subscribe SET debt = $1, payment_date = CURRENT_DATE 
                WHERE client_id = $2 AND service_id = $3 RETURNING *`,
                [newDebt, client_id, service_id]
            );
    
            if (!updateDebt.rows.length) {
                return { success: false, message: 'Не удалось обновить долг' };
            }
    
            return {
                success: true,
                message: newDebt === 0
                    ? 'Оплата полностью завершена!'
                    : `Частичная оплата успешна, осталось оплатить ${newDebt} ₽`
            };
    
        } catch (err) {
            console.error('Ошибка при оплате:', err);
            return { success: false, message: `Ошибка: ${err.message}` };
        }
    };
    
};

module.exports = new UserController();