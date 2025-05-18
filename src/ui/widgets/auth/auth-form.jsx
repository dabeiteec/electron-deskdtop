import React, { useState } from 'react';
import { CustomButton } from '../../shareds/buttons/button';
import { CustomInput } from '../../shareds/input/customInput';
import './style.css';

const AuthForm = () => {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleNameChange = (e) => {setName(e.target.value)};
    const handlePasswordChange = (e) => {setPassword(e.target.value)};

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);

        if (!name || !password) {
            setError('Пожалуйста, заполните все поля');
            return;
        }
        
        try {
            const response = await window.api.Login(name, password);
            if (response.success) {
                sessionStorage.setItem('userIdFromStorage', JSON.stringify(response.user_id));
                return;
            }
            alert(response.message);
        } catch (err) {
            alert(`Ошибка при входе: ${err.message}`);
            setError(err.message);
        }

    }
    const handleRegistrade = async (e) => {
        e.preventDefault();
        setError(null);

        if (!name || !password) {
            setError('Пожалуйста, заполните все поля');
            return;
        }
        
        try {
            const response = await window.api.CreateUser(name, password);
            if (response.error) {
                setError(response.error);
                return;
            }
            alert(response.message);
        } catch (err) {
            setError(err.message);
        } 
    };

    return (
        <div className="create-user-container">
            <form className="create-user-form">
                <h2>Создание нового пользователя</h2>
                
                <div className="form-group">
                    <CustomInput placeholder="Имя пользователя" value={name} onChange={handleNameChange}/>
                </div>
                <div className="form-group">
                    <CustomInput placeholder="Пароль" value={password} onChange={handlePasswordChange}/>
                </div>
                {error && <div className="error-message">{error}</div>}
                <div>
                    <CustomButton title={'Регистрация'} onClick={handleRegistrade}/>
                    <CustomButton title={'Вход'}  onClick={handleLogin}/>
                </div>
            </form>
        </div>
    );
};

export default AuthForm;