import React from 'react';

export default function DiscountCell(cell) {
  return (
    <div className={cell.data.change > 0 ? 'inc' : 'dec' }>
      <span>{cell.text}</span>
    </div>
  );
}
