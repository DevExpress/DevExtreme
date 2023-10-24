import React from 'react';
import DataCell from './DataCell.js';

const DataCellMonth = (props) => {
  const { startDate } = props.data;
  const day = startDate.getDate();
  return (
    <DataCell
      data={props.data}
      className="dx-scheduler-date-table-cell-text"
    >
      {day}
    </DataCell>
  );
};
export default DataCellMonth;
