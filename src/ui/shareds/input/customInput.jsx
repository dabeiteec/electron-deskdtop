import React from 'react';
import './input.css';


export const CustomInput = ({ placeholder, value, onChange}) => {
  return(
      <input className='custom-input' placeholder={placeholder} value={value} onChange={onChange} />
  );
};

