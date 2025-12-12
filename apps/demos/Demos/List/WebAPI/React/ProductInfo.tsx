import React from 'react';

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

interface ProductInfoData {
  ProductName: string;
  UnitPrice: number;
}

export default function ProductInfo(item: ProductInfoData) {
  return (
    <React.Fragment>
      <div>{item.ProductName}</div>
      <b className="price">{currencyFormatter.format(item.UnitPrice)}</b>
    </React.Fragment>
  );
}
