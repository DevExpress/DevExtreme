import { DataGridTypes } from 'devextreme-react/data-grid';
import React from 'react';

const PriceCell = (cell: DataGridTypes.ColumnCellTemplateData) => (
  <div className={cell.data.change > 0 ? 'inc' : 'dec' }>
    <span>{cell.text}</span>
  </div>
);

export default PriceCell;
