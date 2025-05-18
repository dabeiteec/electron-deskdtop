const { contextBridge, ipcRenderer } = require('electron');
const { Payment } = require('./src/core/controllers/user.controller');

contextBridge.exposeInMainWorld('api', {
    CreateUser: (name, password) => ipcRenderer.invoke('CreateUser', name, password),
    Login: (name, password) => ipcRenderer.invoke('Login', name, password),

    CreateClient: (user_id,name, adress, phone) => ipcRenderer.invoke('CreateClient',user_id, name, adress, phone),
    //TODO ренейм хендлеров
    getAllClients: () => ipcRenderer.invoke('getAllClients'),
    getClientInfo:(id) => ipcRenderer.invoke('getClientInfo',id),
    ChangeBalance: (user_id,id, balance) => ipcRenderer.invoke('ChangeBalance',user_id, id, balance),

    GetAllCompany: () => ipcRenderer.invoke('GetAllCompany'),
    GetClientSubscriptions: (client_id) => ipcRenderer.invoke('GetClientSubscriptions', client_id),

    SubscribeClient: (user_id,client_id, service_id) => ipcRenderer.invoke('SubscribeClient',user_id, client_id, service_id),
    UnsubscribeClient: (user_id,client_id, service_id) => ipcRenderer.invoke('UnsubscribeClient',user_id, client_id, service_id),
    GetClientCompany: () => ipcRenderer.invoke('GetClientSubscriptions'),

    UpdateDebt:(user_id,client_id, service_id, debt)=> ipcRenderer.invoke('UpdateDebt',user_id,client_id, service_id, debt),
    UpdateMeterValue: (user_id,client_id, service_id, meter_value) => ipcRenderer.invoke('UpdateMeterValue',user_id, client_id, service_id, meter_value),
    Payment: (user_id,client_id, service_id, balance, debt) => ipcRenderer.invoke('Payment',user_id, client_id, service_id, balance, debt), 

    GetServiceTypes: () => ipcRenderer.invoke('GetServiceTypes'),
    CreateCompany: (user_id, companyName, companyPrice,companyType) => ipcRenderer.invoke('CreateCompany', user_id, companyName, companyPrice,companyType),
    CreateUtilityType: (user_id, utilityTypeName) => ipcRenderer.invoke('CreateUtilityType', user_id, utilityTypeName),
});
