import React from 'react';
import DataCell from './DataCell.js';

const DataCellMonth = (props) => {
  const { startDate } = props.data;
  return (
    <DataCell
      data={props.data}
      className="dx-scheduler-date-table-cell-text"
    >
      {startDate.getDate()}
    </DataCell>
  );
};
export default DataCellMonth;
