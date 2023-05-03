import React from 'react';
import {
  TreeList, Editing, Column, RequiredRule, Lookup, Button,
} from 'devextreme-react/tree-list';
import { employees } from './data.js';

const expandedRowKeys = [1, 2, 3, 4, 5];

const headDataSource = {
  store: employees,
  sort: 'Full_Name',
};

class App extends React.Component {
  allowDeleting(e) {
    return e.row.data.ID !== 1;
  }

  render() {
    return (
      <div id="tree-list-demo">
        <TreeList
          id="employees"
          dataSource={employees}
          showRowLines={true}
          showBorders={true}
          columnAutoWidth={true}
          defaultExpandedRowKeys={expandedRowKeys}
          keyExpr="ID"
          parentIdExpr="Head_ID"
          onEditorPreparing={this.onEditorPreparing}
          onInitNewRow={this.onInitNewRow}
        >
          <Editing
            allowUpdating={true}
            allowDeleting={this.allowDeleting}
            allowAdding={true}
            mode="row" />
          <Column
            dataField="Full_Name">
            <RequiredRule />
          </Column>
          <Column
            dataField="Head_ID"
            caption="Head">
            <Lookup
              dataSource={headDataSource}
              valueExpr="ID"
              displayExpr="Full_Name" />
            <RequiredRule />
          </Column>
          <Column
            dataField="Title"
            caption="Position">
            <RequiredRule />
          </Column>
          <Column
            width={120}
            dataField="Hire_Date"
            dataType="date">
            <RequiredRule />
          </Column>
          <Column type="buttons">
            <Button name="edit" />
            <Button name="delete" />
          </Column>
        </TreeList>
      </div>
    );
  }

  onEditorPreparing(e) {
    if (e.dataField === 'Head_ID' && e.row.data.ID === 1) {
      e.cancel = true;
    }
  }

  onInitNewRow(e) {
    e.data.Head_ID = 1;
  }
}

export default App;
