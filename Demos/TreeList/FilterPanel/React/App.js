import React from 'react';
import { TreeList, FilterRow, FilterPanel, HeaderFilter, Column } from 'devextreme-react/tree-list';
import { employees } from './data.js';

const expandedRowKeys = [1];

const filterValue = ['City', '=', 'Bentonville'];

class App extends React.Component {
  render() {
    return (
      <TreeList
        id="employees"
        dataSource={employees}
        defaultExpandedRowKeys={expandedRowKeys}
        defaultFilterValue={filterValue}
        showBorders={true}
        keyExpr="ID"
        parentIdExpr="Head_ID"
      >
        <FilterRow visible={true} />
        <FilterPanel visible={true} />
        <HeaderFilter visible={true} />
        <Column dataField="Full_Name" dataType="string" />
        <Column dataField="Title" caption="Position" dataType="string" />
        <Column dataField="City" dataType="string" />
        <Column dataField="State" dataType="string" />
        <Column dataField="Mobile_Phone" dataType="string" />
        <Column dataField="Hire_Date" dataType="date" />
      </TreeList>
    );
  }
}

export default App;
