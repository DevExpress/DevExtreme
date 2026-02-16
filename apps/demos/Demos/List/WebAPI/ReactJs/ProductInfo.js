import React from 'react';

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
export default function ProductInfo(item) {
  return (
    <>
      <div>{item.ProductName}</div>
      <b className="price">{currencyFormatter.format(item.UnitPrice)}</b>
    </>
  );
}
