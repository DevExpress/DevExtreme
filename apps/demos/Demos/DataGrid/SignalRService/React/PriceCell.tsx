import React from 'react';

import type { DataGridTypes } from 'devextreme-react/data-grid';

const PriceCell = (cell: DataGridTypes.ColumnCellTemplateData) => (
  <div className={cell.data.change > 0 ? 'inc' : 'dec' }>
    <span>{cell.text}</span>
  </div>
);

export default PriceCell;
