import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CustomButton } from '../../shareds/buttons/button';
import { FaTrash } from 'react-icons/fa';
import './style.css';

const ClientSubscriptions = () => {
    const {id}  = useParams();
    const client_id = id;
    const user_id = sessionStorage.getItem('userIdFromStorage');

    const [companies, setCompanies] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchedCompany = await window.api.GetAllCompany();
                if (fetchedCompany.success) {
                    setCompanies(fetchedCompany.company);
                } else {
                    setError(fetchedCompany.message);
                }
            } catch (err) {
                setError('Ошибка: ' + err.message);
            }
        };
        fetchData();
    }, []);

    const handleSubscribe = async (service_id) => {
        try {
            const response = await window.api.SubscribeClient(user_id,client_id, service_id);
            alert(response.message);
        } catch (err) {
            alert('Ошибка подписки: ' + err.message);
        }
    };

    const handleUnsubscribe = async (service_id) => {
        try {
            const response = await window.api.UnsubscribeClient(user_id,client_id, service_id);
            alert(response.message);
        } catch (err) {
            alert('Ошибка отписки: ' + err.message);
        }
    };

    if (error) return <div className="client-subscriptions">{error}</div>;
    if (!companies.length) return <div className="client-subscriptions">Загрузка...</div>;

    return (
        <div className="client-subscriptions">
            <h2>Подписки клиента</h2>
            <ul>
                {companies.map(company => (
                    <li key={company.id} className="company-item">
                        <span>
                            {company.name} ({company.service}) — {company.price}₽
                        </span>
                        <div className="actions">
                            <CustomButton title="Подписаться"onClick={() => handleSubscribe(company.id)}/>
                            <button className="trash-btn"onClick={() => handleUnsubscribe(company.id)}title="Отписаться">
                                <FaTrash />
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ClientSubscriptions;
