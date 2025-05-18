import React from 'react';
import './userCard.css';
import { Link } from 'react-router-dom';
import { CustomButton } from '../../shareds/buttons/button';

const UserCard = ({ user }) => {
    return (
        <div className="user-card">
            <div className="user-name">{user.name}</div>
            <div className="user-email">{user.address}</div>
            <Link to={`/about-user/${user.id}`}>
                <CustomButton title={'Подробнее'} />
            </Link>
        </div>
    );
    };

export default UserCard;
