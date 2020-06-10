import React from 'react';
import { TreeList, Column, ColumnChooser } from 'devextreme-react/tree-list';
import { employees } from './data.js';

const expandedRowKeys = [1];

class App extends React.Component {
  render() {
    return (
      <TreeList
        id="employees"
        dataSource={employees}
        showBorders={true}
        columnHidingEnabled={true}
        showRowLines={true}
        defaultExpandedRowKeys={expandedRowKeys}
        keyExpr="ID"
        parentIdExpr="Head_ID"
      >
        <Column dataField="Title" caption="Position" />
        <Column dataField="Full_Name" />
        <Column dataField="City" />
        <Column hidingPriority={0} dataField="State" />
        <Column hidingPriority={1} dataField="Mobile_Phone" />
        <Column hidingPriority={2} dataField="Hire_Date" dataType="date" />
        <ColumnChooser enabled={true} mode="select" />
      </TreeList>
    );
  }
}

export default App;
