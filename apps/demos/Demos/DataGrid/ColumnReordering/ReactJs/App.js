import React from 'react';
import DataGrid, { Column, ColumnFixing } from 'devextreme-react/data-grid';
import { employees } from './data.js';

const calculateCellValue = (data) => [data.Title, data.FirstName, data.LastName].join(' ');
const App = () => (
  <DataGrid
    id="gridContainer"
    dataSource={employees}
    keyExpr="ID"
    allowColumnReordering={true}
    columnAutoWidth={true}
    showBorders={true}
  >
    <ColumnFixing enabled={true} />
    <Column
      caption="Employee"
      fixed={true}
      calculateCellValue={calculateCellValue}
    />
    <Column
      dataField="BirthDate"
      dataType="date"
    />
    <Column
      dataField="Address"
      width={190}
      fixed={true}
      fixedPosition="sticky"
    />
    <Column dataField="Zipcode" />
    <Column
      dataField="HireDate"
      dataType="date"
    />
    <Column
      dataField="Position"
      alignment="right"
    />
    <Column
      dataField="City"
      fixed={true}
      fixedPosition="right"
    />
    <Column
      dataField="State"
      fixed={true}
      fixedPosition="right"
    />
    <Column dataField="Department" />
    <Column dataField="HomePhone" />
    <Column dataField="MobilePhone" />
    <Column dataField="Skype" />
    <Column dataField="Email" />
  </DataGrid>
);
export default App;
