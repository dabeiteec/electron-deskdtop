const { ipcMain } = require('electron');
const UserContoller = require('../controllers/user.controller');

const registerIpcUserHandlers = () => {

    ipcMain.handle('getAllClients', async (event) => {
        try{
            const response = await UserContoller.GetAllClients();
            if (!response) {
                return { message: 'Ошибка пролучения данных' };
            };
            return response;
        }catch(err){
            console.error('Ошибка при обработке события getAllClients:', err);
            return { message: 'Ошибка при обработке запроса' };
        }
    });

    ipcMain.handle('getClientInfo',async (event, id) => {
        try{
            const response = await UserContoller.GetClientInfo(id);
            if (!response) {
                return { message: 'Ошибка пролучения данных' };
            };
            return response;
        }catch(err){
            console.error('Ошибка при обработке события getClientinfo:', err);
            return { message: 'Ошибка при обработке запроса' };
        }
    });

    ipcMain.handle('CreateClient', async (event,user_id, name, adress, phone) => {
        try{
            const response = await UserContoller.CreateClient(user_id,name, adress, phone);
            if (!response) {
                return { message: 'Ошибка пролучения данных' };
            };
            return response;
    
        }catch(err){
            console.error('Ошибка при обработке события CreateClient:', err);
            return { message: 'Ошибка при обработке запроса' };
        }
    });

    ipcMain.handle('ChangeBalance', async (event,user_id, id, balance) => {
        try{
            const response = await UserContoller.ChangeBalance(user_id,id, balance);
            if (!response) {
                return { message: 'Ошибка пролучения данных' };
            };
            return response;
    
        }catch(err){
            console.error('Ошибка при обработке события ChangeBalance:', err);
            return { message: 'Ошибка при обработке запроса' };
        }
    });

    ipcMain.handle('SubscribeClient', async (event,user_id, client_id, service_id) => {
        try{
            const response = await UserContoller.SubscribeClient(user_id,client_id, service_id);
            if (!response) {
                return { message: 'Ошибка пролучения данных' };
            };
            return response;
    
        }catch(err){
            console.error('Ошибка при обработке события SubscribeClient:', err);
            return { message: 'Ошибка при обработке запроса' };
        }
    });

    ipcMain.handle('UnsubscribeClient', async (event,user_id, client_id, service_id) => {
        try{
            const response = await UserContoller.UnsubscribeClient(user_id,client_id, service_id);
            if (!response) {
                return { message: 'Ошибка пролучения данных' };
            };
            return response;
    
        }catch(err){
            console.error('Ошибка при обработке события UnsubscribeClient:', err);
            return { message: 'Ошибка при обработке запроса' };
        }
    });

    ipcMain.handle('GetClientSubscriptions', async (event, client_id) => {
        try{
            const response = await UserContoller.GetClientSubscriptions(client_id);
            if (!response) {
                return { message: 'Ошибка пролучения данных' };
            };
            return response;
    
        }catch(err){
            console.error('Ошибка при обработке события GetClientSubscriptions:', err);
            return { message: 'Ошибка при обработке запроса' };
        }
    });

    ipcMain.handle('UpdateMeterValue', async (event,user_id, client_id, service_id, meter_value) => {
        try{
            const response = await UserContoller.UpdateMeterValue(user_id,client_id, service_id, meter_value);
            if (!response) {
                return { message: 'Ошибка пролучения данных' };
            };
            return response;
        }catch(err){
            console.error('Ошибка при обработке события UpdateMeterValue:', err);
            return { message: 'Ошибка при обработке запроса' };
        }
    });

    ipcMain.handle('UpdateDebt', async (event,user_id, client_id, service_id, debt) => {
        try{
            const response = await UserContoller.UpdateDebt(user_id,client_id, service_id, debt);
            if (!response) {
                return { message: 'Ошибка пролучения данных' };
            };
            return response;
        }catch(err){
            console.error('Ошибка при обработке события UpdateDebt:', err);
            return { message: 'Ошибка при обработке запроса' };
        }
    });

    ipcMain.handle('Payment', async (event,user_id, client_id, service_id,balance, debt) => {
        try{
            const response = await UserContoller.Payment(user_id, client_id, service_id, balance, debt);
            if (!response) {
                return { message: 'Ошибка пролучения данных' };
            };
            return response;
        }catch(err){
            console.error('Ошибка при обработке события Payment:', err);
            return { message: 'Ошибка при обработке запроса' };
        }
    });

};

module.exports = registerIpcUserHandlers;