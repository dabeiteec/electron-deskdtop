const { ipcMain } = require('electron');
const AuthContoller = require('../controllers/auth.controller');

const registerIpcAuthHandlers = () => {
    ipcMain.handle('CreateUser', async (event,name,password) => {
        try{
            const response = await AuthContoller.CreateUser(name,password);
            if (!response) {
                return { success:false, message: `Ошибка на уровне хендлера: ${response.message}` };
            };
            return  response;
        }catch(err){
            console.error('Ошибка при обработке события getAllClients:', err);
            return { success:false, message: `Ошибка на уровне хендлера catch: ${response.message}  ${err.message}` };
        }
    });
    
    ipcMain.handle('Login', async (event,name, password) => {
        try{
            const response = await AuthContoller.Login(name, password);
            if (!response) {
                return { success:false, message: `Ошибка на уровне хендлера: ${response.message}` };
            };
            return  response;
    
        }catch(err){
            console.error('Ошибка при обработке события CreateClient:', err);
            return { success:false, message: `Ошибка на уровне хендлера catch: ${response.message}  ${err.message}` };
        }
    });
}

module.exports = registerIpcAuthHandlers;