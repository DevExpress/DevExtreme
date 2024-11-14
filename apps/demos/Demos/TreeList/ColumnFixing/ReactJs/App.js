import React from 'react';
import { TreeList, Column, ColumnFixing } from 'devextreme-react/tree-list';
import { employees } from './data.js';

const calculateCellValue = (data) => [data.Title, data.FirstName, data.LastName].join(' ');
const App = () => (
  <TreeList
    id="employees"
    dataSource={employees}
    keyExpr="ID"
    parentIdExpr="Head_ID"
    columnAutoWidth={true}
    showBorders={true}
    showRowLines={true}
    autoExpandAll={true}
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
    <Column
      dataField="Email"
      fixed={true}
      fixedPosition="sticky"
    />
    <Column dataField="Skype" />
  </TreeList>
);
export default App;
