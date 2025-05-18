const db = require('../database/pool');

class CompanyController {
    async GetAllCompany() {
        try {
            const requestedCompany = await db.query('SELECT * FROM company',);
            console.log(requestedCompany.rows);
            return {
                success: true,
                company: requestedCompany.rows,
            };
        } catch (err) {
            console.error('Registration Error:', err);
            return { message: `Database error: ${err}` };
        }
    };
    async GetServiceTypes() {
        try {
            const result = await db.query(
                `SELECT unnest(enum_range(NULL::service_enum)) AS service`
            );
            console.log('Полученные типы услуг:', result.rows);
            return {
                success: true,
                services: result.rows.map(r => r.service),
            };
            } catch (err) {
            console.error('Ошибка получения типов услуг:', err);
            return {
                success: false,
                message: `Ошибка при чтении service_enum: ${err.message}`,
            };
            }
        }
    
    async CreateCompany(id, companyName, companyPrice,companyType) {
        try {
            console.log('Creating company with ID:', id, 'Name:', companyName, 'Price:', companyPrice);
            const response = await db.query(
                'INSERT INTO company (user_id, name, price, service) VALUES ($1, $2, $3, $4) RETURNING *',
                [id, companyName, companyPrice,companyType]
            );
            return {
                message: 'Компания успешно создана!',
                company: response.rows[0],
            };
        } catch (err) {
            console.error('Registration Error:', err);
            return { message: `Database error: ${err}` };
        }
    };
}

module.exports = new CompanyController();