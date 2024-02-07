import { DataGridTypes } from 'devextreme-react/data-grid';
import React from 'react';

const ChangeCell = (cell: DataGridTypes.ColumnCellTemplateData) => (
  <div className={cell.data.change > 0 ? 'inc' : 'dec' }>
    <span className="current-value">{cell.text}</span>
    <span className="arrow"></span>
    <span className="diff">{cell.data.percentChange.toFixed(2)}%</span>
  </div>
);

export default ChangeCell;
