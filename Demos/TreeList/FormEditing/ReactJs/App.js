import React from 'react';
import {
  TreeList,
  Editing,
  Column,
  ValidationRule,
  Lookup,
  Button,
} from 'devextreme-react/tree-list';
import { employees } from './data.js';

const expandedRowKeys = [1, 2, 3, 4, 5];
const lookupData = {
  store: employees,
  sort: 'Full_Name',
};
const allowDeleting = (e) => e.row.data.ID !== 1;
const onEditorPreparing = (e) => {
  if (e.dataField === 'Head_ID' && e.row.data.ID === 1) {
    e.editorOptions.disabled = true;
    e.editorOptions.value = null;
  }
};
const onInitNewRow = (e) => {
  e.data.Head_ID = 1;
};
const App = () => (
  <div id="tree-list-demo">
    <TreeList
      dataSource={employees}
      columnAutoWidth={true}
      showRowLines={true}
      showBorders={true}
      defaultExpandedRowKeys={expandedRowKeys}
      keyExpr="ID"
      parentIdExpr="Head_ID"
      onEditorPreparing={onEditorPreparing}
      onInitNewRow={onInitNewRow}
    >
      <Editing
        allowUpdating={true}
        allowDeleting={allowDeleting}
        allowAdding={true}
        mode="form"
      />
      <Column dataField="Full_Name">
        <ValidationRule type="required" />
      </Column>
      <Column
        dataField="Prefix"
        caption="Title"
      >
        <ValidationRule type="required" />
      </Column>
      <Column
        visible={false}
        dataField="Head_ID"
        caption="Head"
      >
        <Lookup
          dataSource={lookupData}
          valueExpr="ID"
          displayExpr="Full_Name"
        />
        <ValidationRule type="required" />
      </Column>
      <Column
        dataField="Title"
        caption="Position"
      >
        <ValidationRule type="required" />
      </Column>
      <Column
        width={150}
        dataField="City"
      >
        <ValidationRule type="required" />
      </Column>
      <Column
        width={120}
        dataField="Hire_Date"
        dataType="date"
      >
        <ValidationRule type="required" />
      </Column>
      <Column type="buttons">
        <Button name="edit" />
        <Button name="delete" />
      </Column>
    </TreeList>
  </div>
);
export default App;
