import React from 'react';

function formatPrice(price) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export default function Item({
  Address, City, State, Price, Image,
}) {
  return (
    <div>
      <img src={Image} />
      <div className='item-price'>{formatPrice(Price)}</div>
      <div className='item-address'>{`${Address}, ${City}, ${State}`}</div>
    </div>
  );
}
