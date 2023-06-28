import React from 'react';
import {
  TreeList, HeaderFilter, Search, Selection, Column,
} from 'devextreme-react/tree-list';
import { employees } from './data.js';

const expandedRowKeys = [1];

const searchFields = ['City', 'State'];
const searchEditorOptions = { placeholder: 'Search city or state' };

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
        <HeaderFilter visible={true} />
        <Selection mode="single" />
        <Column dataField="Full_Name" />
        <Column dataField="Title" caption="Position">
          <HeaderFilter allowSelectAll={false}>
            <Search
              enabled={true}
            />
          </HeaderFilter>
        </Column>
        <Column dataField="City">
          <HeaderFilter>
            <Search
              enabled={true}
              searchExpr={searchFields}
              editorOptions={searchEditorOptions} />
          </HeaderFilter>
        </Column>
        <Column dataField="State" />
        <Column dataField="Mobile_Phone" />
        <Column dataField="Hire_Date" dataType="date" />
      </TreeList>
    );
  }
}

export default App;
