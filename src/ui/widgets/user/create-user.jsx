import React, { useState } from 'react';
import { CustomButton } from '../../shareds/buttons/button';
import { CustomInput } from '../../shareds/input/customInput';
import './style.css';

const CreateUserForm = () => {
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState(''); 
    const [error, setError] = useState(null);

    const handleNameChange = (e) => {setName(e.target.value);};
    const handlePhoneChange = (e) => {setPhone(e.target.value);};
    const handleAddressChange = (e) => {setAddress(e.target.value);};

    const handleCreate = async (e) => {
        e.preventDefault();
        setError(null);
        
        if (!name || !address || !phone) {
            setError('Пожалуйста, заполните все поля');
            return;
        }
        
        try {
            const user_id = sessionStorage.getItem('userIdFromStorage');
            const response = await window.api.CreateClient(user_id,name, address, phone);
            alert(response.message);
            setName('');
            setAddress('');
            setPhone('');
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
                    <CustomInput placeholder="Телефон" value={phone} onChange={handlePhoneChange}
                    />
                </div>
                <div className="form-group">
                    <CustomInput placeholder="Адрес" value={address} onChange={handleAddressChange}/>
                </div>
                
                {error && <div className="error-message">{error}</div>}
                <CustomButton  title={'Создать'} onClick={handleCreate}/>
            </form>
        </div>
    );
};

export default CreateUserForm;