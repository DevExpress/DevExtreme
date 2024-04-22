import { DataGridTypes } from 'devextreme-react/data-grid';
import React from 'react';

const formatDate = new Intl.DateTimeFormat('en-US').format;

const DataRow = (rowInfo: DataGridTypes.RowTemplateData) => (
  <React.Fragment>
    <tr className="main-row" role="row">
      <td rowSpan={2} role="gridcell"><img src={rowInfo.data.Picture} alt={`Picture of ${rowInfo.data.FirstName} ${rowInfo.data.LastName}`} tabIndex={0} /></td>
      <td role="gridcell">{rowInfo.data.Prefix}</td>
      <td role="gridcell">{rowInfo.data.FirstName}</td>
      <td role="gridcell">{rowInfo.data.LastName}</td>
      <td role="gridcell">{rowInfo.data.Position}</td>
      <td role="gridcell">{formatDate(new Date(rowInfo.data.BirthDate))}</td>
      <td role="gridcell">{formatDate(new Date(rowInfo.data.HireDate))}</td>
    </tr>
    <tr className="notes-row" role="row">
      <td colSpan={6} role="gridcell"><div>{rowInfo.data.Notes}</div></td>
    </tr>
  </React.Fragment>
);

export default DataRow;
