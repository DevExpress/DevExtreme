import React from 'react';

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export default function ProductInfo(item) {
  return (
    <div className="product">
      <img src={item.ImageSrc} />
      <div>{item.Name}</div>
      <div className="price">{currencyFormatter.format(item.Price)}</div>
    </div>
  );
}
