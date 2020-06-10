import React from 'react';
import { TreeList, Column, ColumnFixing } from 'devextreme-react/tree-list';
import { employees } from './data.js';

const expandedRowKeys = [1, 2, 10];

class App extends React.Component {
  render() {
    return (
      <TreeList
        id="employees"
        dataSource={employees}
        columnAutoWidth={true}
        showRowLines={true}
        showBorders={true}
        defaultExpandedRowKeys={expandedRowKeys}
        keyExpr="ID"
        parentIdExpr="Head_ID"
      >
        <Column dataField="Title" caption="Position" />
        <Column fixed={true} dataField="Full_Name" />
        <Column dataField="City" />
        <Column dataField="State" />
        <Column dataField="Mobile_Phone" />
        <Column dataField="Email" />
        <Column dataField="Hire_Date" dataType="date" />
        <Column dataField="Birth_Date" dataType="date" />
        <Column dataField="Skype" />
        <ColumnFixing enabled={true} />
      </TreeList>
    );
  }
}

export default App;
