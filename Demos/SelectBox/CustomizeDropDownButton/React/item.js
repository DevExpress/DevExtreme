import React from 'react';

export default function Item({ IconSrc, Name }) {
  return (
    <div className='custom-item'>
      <img src={`../../../../images/icons/${IconSrc}`} />
      <div className='product-name'>
        { Name }
      </div>
    </div>
  );
}
