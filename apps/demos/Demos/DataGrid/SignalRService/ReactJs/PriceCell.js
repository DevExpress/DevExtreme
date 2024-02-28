import React from 'react';

const PriceCell = (cell) => (
  <div className={cell.data.change > 0 ? 'inc' : 'dec'}>
    <span>{cell.text}</span>
  </div>
);
export default PriceCell;
