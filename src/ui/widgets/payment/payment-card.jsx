import React, { useState,useEffect } from 'react';
import './PaymentCard.css';
import { CustomInput } from '../../shareds/input/customInput';

// Вспомогательные функции форматирования
const formatServiceName = (service) => {
    const names = {
        cold_water: 'Холодная вода',
        hot_water: 'Горячая вода',
        gas: 'Газоснабжение',
        electricity: 'Электроэнергия'
    };
    return names[service] || service;
};

const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('ru-RU', options);
};

const PaymentCard = ({ company, balance, client_id}) => {
    const user_id = sessionStorage.getItem('userIdFromStorage');

    const [currentMeterValue, setCurrentMeterValue] = useState('');
    const [currentDebt, setCurrentDebt] = useState(company.debt || 0);
    const [error, setError] = useState('');
    const [isEnabled, setIsEnabled] = useState(false);

    const handleMeterValueChange = (e) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 8);; 
        setCurrentMeterValue(value);
    }

    const isPaymentOverdue = company.payment_date ? (new Date() - new Date(company.payment_date)) > 30 * 24 * 60 * 60 * 1000: true;

    useEffect(() => {
        if (currentMeterValue && Number(currentMeterValue) < company.last_meter_value) {
                setError('Значение счетчика не может быть меньше предыдущего!');
                setIsEnabled(false);
            } else {
                setError('');
                setIsEnabled(true);
            }
        }, 
        [currentMeterValue, company.last_meter_value]);

        
    const handleCalculate = async () => {
        try{
            const updatedDebt =  (parseInt(currentMeterValue) - parseInt(company.last_meter_value)) * parseInt(company.price);
            setCurrentDebt(updatedDebt);
            await window.api.UpdateMeterValue(user_id,client_id, company.id, currentMeterValue);
            await window.api.UpdateDebt(user_id,client_id, company.id, updatedDebt);
        }catch(err){
            console.error('Ошибка при расчете задолженности:', err);
        }
    };

    const handlePayment = async () => {
        try {
            if (balance <= 0) {
                setError('На балансе недостаточно средств!');
                return;
            }

            if(balance >= currentDebt) {
                var newBalance = balance - currentDebt;
                var newDebt = 0;
            }else{
                var newDebt = currentDebt - balance;
                var newBalance = 0;
            }
            
            
            const result = await window.api.Payment(user_id, client_id, company.id, newBalance,newDebt);
    
            if (result.success) {
                alert(result.message);
                setCurrentDebt(newDebt);
                setError('');
                setCurrentMeterValue('');
            } else {
                setError(result.message || 'Ошибка при частичной оплате');
            }
    
        } catch (err) {
            console.error('Ошибка при оплате:', err);
            setError('Системная ошибка при оплате');
        }
    };

    return (
        <div 
            className="payment-card" 
            style={{ borderColor: isPaymentOverdue ? 'red' : 'green' }}
        >
            <h3>{company.name}</h3>
            <p>Услуга: {formatServiceName(company.service)}</p>
            
            <div style={{ display: 'flex', flexDirection: 'row', gap: '10px', alignItems: 'end' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <p>Последние показания: {currentMeterValue|| company.last_meter_value}</p>
                    <CustomInput placeholder={'Новые показания'} value={currentMeterValue} onChange={handleMeterValueChange}/>
                </div>
                <button title={'Посчитать'} onClick={handleCalculate} disabled={!isEnabled}>
                    Посчитать
                </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'row', gap: '10px', alignItems: 'center' }}>
                <p>Цена: {company.price} ₽</p>
                
                <p>Задолженность: {currentDebt } ₽</p>
                <button title={'Оплатить'} disabled={!isEnabled} onClick={handlePayment}>
                    Оплатить
                </button>
            </div>
            
            {company.payment_date && (
                <p style={{ color: isPaymentOverdue ? 'red' : 'green' }}>
                    Последняя оплата: {formatDate(company.payment_date)}
                </p>
            )}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default PaymentCard;