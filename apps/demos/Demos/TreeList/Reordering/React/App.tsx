import React from 'react';
import { TreeList, Column, ColumnFixing } from 'devextreme-react/tree-list';
import { Employee, employees } from './data.ts';

const calculateCellValue = (data: Employee) => [data.Title, data.FirstName, data.LastName].join(' ');

const App = () => (
  <TreeList
    id="employees"
    dataSource={employees}
    keyExpr="ID"
    parentIdExpr="Head_ID"
    allowColumnReordering={true}
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
      dataField="BirthDate"
      dataType="date"
    />
    <Column
      dataField="Address"
      width={190}
      fixed={true}
      fixedPosition="sticky"
    />
    <Column dataField="Zipcode"/>
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
  </TreeList>
);

export default App;
