const { ipcMain } = require('electron');
const CompanyController = require('../controllers/company.controller');

const registerIpcCompanyHandlers = () => {
    ipcMain.handle('GetAllCompany', async (event) => {
        try{
            const response = await CompanyController.GetAllCompany();

            return response;
        }catch(err){
            console.error('Ошибка при обработке события getAllCompany:', err);
            return { message: 'Ошибка при обработке запроса' };
        }
    });

    ipcMain.handle('GetServiceTypes', async (event) => {
        try{
            const response = await CompanyController.GetServiceTypes();

            if (!response) {return { message: 'Ошибка пролучения данных' };};

            return response;
        } catch(err){
            console.error('Ошибка при обработке события GetServiceTypes:', err);
            return { message: 'Ошибка при обработке запроса' };
        };
    });

    ipcMain.handle('CreateCompany', async (event, user_id, companyName, companyPrice,companyType) => {
        try{
            const response = await CompanyController.CreateCompany(user_id, companyName, companyPrice,companyType);

            if (!response) {return { message: 'Ошибка пролучения данных' };};

            return response;
        }catch(err){
            console.error('Ошибка при обработке события CreateCompany:', err);
            return { message: 'Ошибка при обработке запроса' };
        }
    });
    
    ipcMain.handle('CreateUtilityType', async (event, id, utilityTypeName) => {
        try{
            const response = await CompanyController.CreateUtilityType(id, utilityTypeName);
            if (!response) {
                return { message: 'Ошибка пролучения данных' };
            };
            return response;
        }catch(err){
            console.error('Ошибка при обработке события CreateUtilityType:', err);
            return { message: 'Ошибка при обработке запроса' };
        }
    });
};

module.exports = registerIpcCompanyHandlers;