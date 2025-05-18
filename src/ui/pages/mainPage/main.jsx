import React, { useState, useEffect } from 'react';
import UserCard from '../../widgets/main/user-card';
import './main-page.css';

const MainPage = () => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const response = await window.api.getAllClients();
                
                if (response.success) {
                    setClients(response.users); 
                } else {
                    setError(response.message || 'Не удалось загрузить клиентов');
                }
            } catch (err) {
                console.error('Ошибка получения клиентов:', err);
                setError(err.message || 'Произошла ошибка при загрузке');
            } finally {
                setLoading(false);
            }
        };

        fetchClients();
    }, []); 

    if (loading) return <div className="main-page">Загрузка...</div>;
    if (error) return <div className="main-page error">{error}</div>;

    return (
        <div className="main-page">
            {clients.map(client => (
                <UserCard key={client.id} user={client} />
            ))}
        </div>
    );
};


export default MainPage;