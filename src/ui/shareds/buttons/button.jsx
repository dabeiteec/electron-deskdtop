import React from 'react';
import './style.css';

export const CustomButton = ({title, onClick = () => {}}) => {
    return (
        <button className="custom-button"onClick={onClick}>
            {title}
        </button>
    );
}

export const NavButton = ({title, onClick = () => {}}) => {
    return (
        <button className="transparent-button"onClick={onClick}>
            {title}
        </button>
    );
}
