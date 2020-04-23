import React from 'react';
import './style.css';

export default function Header({ title }) {
  return (
    <div>
      {title}
      <div className='header-line'></div>
    </div>
  )
}
