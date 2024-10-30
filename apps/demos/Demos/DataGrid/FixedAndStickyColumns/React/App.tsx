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
      width={230}
      fixed={true}
      calculateCellValue={calculateCellValue}
    />
    <Column
      dataField="BirthDate"
      dataType="date"
    />
    <Column
      dataField="HireDate"
      dataType="date"
    />
    <Column
      dataField="Position"
      alignment="right"
    />
    <Column
      dataField="Address"
      width={230}
      fixed={true}
      fixedPosition="sticky"
    />
    <Column dataField="City" />
    <Column
      dataField="State"
      fixed={true}
      fixedPosition="right"
    />
    <Column dataField="HomePhone" />
    <Column dataField="MobilePhone" />
    <Column dataField="Skype" />
    <Column dataField="Email" />
  </DataGrid>
);

export default App;
