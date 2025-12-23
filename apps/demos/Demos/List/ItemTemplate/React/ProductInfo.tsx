import React from 'react';
import type { Product } from './types';

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export default function ProductInfo(item: Product) {
  const {
    Name,
    ImageSrc,
    Price,
  } = item;

  return (
    <div className="product">
      <img alt={Name} src={ImageSrc} />
      <div>{Name}</div>
      <div className="price">{currencyFormatter.format(Price)}</div>
    </div>
  );
}
