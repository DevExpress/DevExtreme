import React from 'react';
import Globalize from 'globalize';
import 'devextreme/localization/globalize/currency';

function gridCellData(gridData) {
  return gridData.data[gridData.column.caption.toLowerCase()];
}

export default function DiffCell(cellData) {
  return (
    <div className={gridCellData(cellData).diff > 0 ? 'inc' : 'dec'}>
      <div className="current-value">{Globalize.formatCurrency(gridCellData(cellData).value, 'USD')}</div>
      <div className="diff">{Math.abs(gridCellData(cellData).diff).toFixed(2)}</div>
    </div>
  );
}
