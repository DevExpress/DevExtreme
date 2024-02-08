import React from 'react';
import 'devextreme/localization/globalize/currency';
import { formatNumber } from 'devextreme/localization';
import { DataGridTypes } from 'devextreme-react/data-grid';

const getGridCellData = (gridData: DataGridTypes.ColumnCellTemplateData) => gridData.data[gridData.column.caption.toLowerCase()];

const DiffCell = (cellData: DataGridTypes.ColumnCellTemplateData) => {
  const gridCellData = getGridCellData(cellData);

  return (
    <div className={gridCellData.diff > 0 ? 'inc' : 'dec'}>
      <div className="current-value">{formatNumber(gridCellData.value, { type: 'currency', currency: 'USD', precision: 2 })}</div>
      <div className="diff">{Math.abs(gridCellData.diff).toFixed(2)}</div>
    </div>
  );
};

export default DiffCell;
