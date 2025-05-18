import React, { useState, useEffect } from 'react';
import { CustomButton } from '../../shareds/buttons/button';
import { Link, useParams } from 'react-router-dom';
import { CustomInput } from '../../shareds/input/customInput';
import PaymentCard from '../../widgets/payment/payment-card';
import './style.css';

const AboutClient = () => {
    const user_id = sessionStorage.getItem('userIdFromStorage');

    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [balance, setBalance] = useState(0);
    const [companies, setCompanies] = useState([]);

    const handleBalcnce = (e) => {
        const value = e.target.value.replace(/\D/g, '');
        setBalance(value);
    };

    const changeBalance = async () => {
        try {
            
            const response = await window.api.ChangeBalance(user_id,id, balance);
            if (response.success) {
                setUser(response.user);
                setBalance(0);
            } else {
                alert(response.message);
            }
        } catch (err) {
            alert('Ошибка: ' + err.message);
        }
    };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const fetchedUser = await window.api.getClientInfo(id);
                if (fetchedUser.success) {
                    setUser(fetchedUser.user);
                } else {
                    setError('Пользователь не найден');
                }
            } catch (err) {
                setError('Ошибка получения данных: ' + err.message);
            }
        };
        const fetchedClientSubscriptions = async () => {
            try {
                const response = await window.api.GetClientSubscriptions(id);
                if (response.success) {
                    setCompanies(response.subscriptions || []);
                } else {
                    setCompanies([]); 
                }
            } catch (err) {
                console.error(err);
                setCompanies([]);
            }
        };
        

        fetchUser();
        fetchedClientSubscriptions();
    }, [id]);

    if (error) return <div className="about-user-container">{error}</div>;
    if (!user) return <div className="about-user-container">Загрузка...</div>;

    return (
        <div className="about-user-container">
            <div className="about-user-info">
                <span>Имя: {user.name}</span>
                <span>Телефон: {user.phone}</span>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Баланс: {user.balance}</span>
                    <CustomInput placeholder={'Баланс'} value={balance} onChange={handleBalcnce} />
                    <CustomButton title={'Пополнить'} onClick={changeBalance} />
                </div>
            </div>
            <div className="about-user-actions">
                <Link to={`/subscribe/${user.id}`}>
                    <CustomButton title={'Подписки'} />
                </Link>
            </div>

            <div className="payment-cards-wrapper">
                {companies.length > 0 ? (
                    companies.map((company) => (
                        <PaymentCard key={company.id} company={company} balance={user.balance} client_id={id} />
                    ))
                ) : (
                    <div className="no-subscriptions">У клиента нет подписок</div>
                )}
            </div>
        </div>
    );
};

export default AboutClient;
