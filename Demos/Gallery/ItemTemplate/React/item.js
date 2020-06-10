import React from 'react';
import Globalize from 'globalize';
import 'devextreme/localization/globalize/currency';

function formatPrice(price) {
  return Globalize.formatCurrency(price, 'USD', { maximumFractionDigits: 0 });
}

export default function Item({ Address, City, State, Price, Image }) {
  return (
    <div>
      <img src={Image} />
      <div className='item-price'>{formatPrice(Price)}</div>
      <div className='item-address'>{`${Address}, ${City}, ${State}`}</div>
    </div>
  );
}
