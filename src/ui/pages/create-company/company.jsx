import React, { useState, useEffect } from 'react';
import { CustomButton } from '../../shareds/buttons/button';
import { CustomInput } from '../../shareds/input/customInput';
import './style.css';

const CreateCompanyPage = () => {
    const user_id = sessionStorage.getItem('userIdFromStorage');

    const [companyName, setCompanyName] = useState('');
    const [companyPrice, setCompanyPrice] = useState('');
    const [companyType, setCompanyType] = useState('');
    const [types, setTypes] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        async function fetchServiceTypes() {
            const res = await window.api.GetServiceTypes();
            if (res.success) {
                setTypes(res.services);
                if (res.services.length > 0) {
                    setCompanyType(res.services[0]);
                }
            } else {
                console.error(res.message);
            }
        }
        fetchServiceTypes();
    }, []);
    

    const handleCreateCompany = async () => {
        setError(null);
        setSuccess(null);

        if (!companyName || !companyPrice || !companyType) {
            setError('Пожалуйста, заполните все поля');
            return;
        }

        try {
            const response = await window.api.CreateCompany(user_id,companyName,companyPrice,companyType);
            if (response.success) {
                setSuccess(response.message);
                setCompanyName('');
                setCompanyPrice('');
            } else {
                setError(response.message);
            }
        } catch (err) {
            console.error('Ошибка при создании компании:', err);
            setError('Ошибка при создании компании');
        }
    };

    return (
        <div className="create-company-page">
            <h1>Создание компании</h1>
            <div className="create-company-form">
                <CustomInput placeholder="Название компании" value={companyName} onChange={e => setCompanyName(e.target.value)}/>
                <CustomInput placeholder="Цена (тариф)" value={companyPrice}onChange={e => setCompanyPrice(e.target.value)}/>
                <select value={companyType}onChange={e => setCompanyType(e.target.value)}>
                    {types.map((t, i) => (
                        <option key={i} value={t}>
                        {t.replace('_', ' ')}
                        </option>
                    ))}
                </select>
                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}
                <CustomButton title="Создать компанию" onClick={handleCreateCompany}/>
            </div>
            {/* <CreateUtilityType /> */}
        </div>
    );
};

export default CreateCompanyPage;


// ------------------------------------------------------------------

const CreateUtilityType = () => {
    const [utilityTypeName, setUtilityTypeName] = useState('');
    const [msg, setMsg] = useState(null);

    const updateUtilityType = async () => {
    if (!utilityTypeName) {
        setMsg('Введите название типа услуги');
        return;
    }
    try {
        const res = await window.api.CreateUtilityType(utilityTypeName);
        setMsg(res.message);
        setUtilityTypeName('');
    } catch (err) {
        console.error(err);
        setMsg('Ошибка при создании типа услуги');
    }
};

return (
    <div className="create-utility-type">
      <h1>Создание типа услуги</h1>
        <div className="create-utility-type-form">
        <CustomInput
          placeholder="Название типа услуги"
          value={utilityTypeName}
          onChange={e => setUtilityTypeName(e.target.value)}
        />
        {msg && <div className="info-message">{msg}</div>}
        <CustomButton title="Создать тип услуги" onClick={updateUtilityType}/>
      </div>
    </div>
  );
};


