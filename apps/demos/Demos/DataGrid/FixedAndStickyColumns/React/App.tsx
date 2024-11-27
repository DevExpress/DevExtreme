import React from 'react';
import DataGrid, { Column, ColumnFixing } from 'devextreme-react/data-grid';

import { Employee, employees } from './data.ts';

const calculateCellValue = (data: Employee) => [data.Title, data.FirstName, data.LastName].join(' ');

const App = () => (
  <DataGrid
    id="gridContainer"
    dataSource={employees}
    keyExpr="ID"
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
      dataField="Position"
      alignment="right"
    />
    <Column
      dataField="Address"
      fixed={true}
      fixedPosition="sticky"
    />
    <Column dataField="City" />
    <Column dataField="Zipcode" />
    <Column dataField="State" />
    <Column
      dataField="Department"
      fixed={true}
      fixedPosition="right"
    />
    <Column
      dataField="BirthDate"
      dataType="date"
    />
    <Column
      dataField="HireDate"
      dataType="date"
    />
    <Column dataField="HomePhone" />
    <Column dataField="MobilePhone" />
    <Column dataField="Email" />
    <Column dataField="Skype" />
  </DataGrid>
);

export default App;
