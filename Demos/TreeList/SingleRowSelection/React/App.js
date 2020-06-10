import React from 'react';
import { TreeList, Selection, Column } from 'devextreme-react/tree-list';
import { employees } from './data.js';

const expandedRowKeys = [1];

class App extends React.Component {
  render() {
    return (
      <TreeList
        dataSource={employees}
        showRowLines={true}
        showBorders={true}
        columnAutoWidth={true}
        defaultExpandedRowKeys={expandedRowKeys}
        keyExpr="ID"
        parentIdExpr="Head_ID"
      >
        <Selection mode="single" />
        <Column dataField="Full_Name" />
        <Column dataField="Title" caption="Position" />
        <Column dataField="City" />
        <Column dataField="State" />
        <Column width={120} dataField="Hire_Date" dataType="date" />
      </TreeList>
    );
  }
}

export default App;
