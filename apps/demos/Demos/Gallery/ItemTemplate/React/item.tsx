import React from 'react';

interface ItemProps {
  Address: string;
  City: string;
  State: string;
  Price: number;
  Image: string;
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export default function Item({
  Address, City, State, Price, Image,
}: ItemProps) {
  return (
    <div>
      <img alt={Address} src={Image} />
      <div className='item-price'>{formatPrice(Price)}</div>
      <div className='item-address'>{`${Address}, ${City}, ${State}`}</div>
    </div>
  );
}
