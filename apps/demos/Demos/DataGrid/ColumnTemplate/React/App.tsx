import React from 'react';
import DataGrid, { Column, DataGridTypes } from 'devextreme-react/data-grid';

import { employees } from './data.ts';

const cellRender = (data: DataGridTypes.ColumnCellTemplateData) => (<img src={data.value} />);

const App = () => (
  <DataGrid
    id="gridContainer"
    dataSource={employees}
    keyExpr="ID"
    showBorders={true}
  >
    <Column
      dataField="Picture"
      width={100}
      allowSorting={false}
      cellRender={cellRender}
    />
    <Column
      dataField="Prefix"
      width={70}
      caption="Title"
    />
    <Column dataField="FirstName" />
    <Column dataField="LastName" />
    <Column dataField="Position" />
    <Column dataField="BirthDate" dataType="date" />
    <Column dataField="HireDate" dataType="date" />
  </DataGrid>
);

export default App;
