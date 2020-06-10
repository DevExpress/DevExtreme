import React from 'react';

export default function ChangeCell(cell) {
  return (
    <div className={cell.data.change > 0 ? 'inc' : 'dec' }>
      <span className="current-value">{cell.text}</span>
      <span className="arrow"></span>
      <span className="diff">{cell.data.percentChange.toFixed(2)}%</span>
    </div>
  );
}
