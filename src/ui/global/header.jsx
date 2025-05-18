import React from 'react';
import { NavButton } from '../shareds/buttons/button.jsx';
import { Link } from 'react-router-dom';

const Header = () => {
    const navButtons = [
        { title: 'Добавить пользователя', path: '/create-user' },
        { title: 'Клиенты', path: '/clients' },
        {title: 'Создать компанию', path: '/company'},
    ];
    
    return (
        <div style={{ display: 'flex', justifyContent: 'space-around', padding: '10px' }}>
            {navButtons.map((btn, index) => (
                <Link key={index} to={btn.path}>
                    <NavButton title={btn.title} />
                </Link>
            ))}
        </div>
    );
};

export default Header;
