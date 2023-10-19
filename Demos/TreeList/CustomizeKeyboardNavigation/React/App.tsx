import React from 'react';

import TreeList, {
  Column,
  Editing,
  KeyboardNavigation,
  TreeListTypes,
} from 'devextreme-react/tree-list';
import SelectBox from 'devextreme-react/select-box';
import CheckBox from 'devextreme-react/check-box';
import { employees } from './data.ts';

const expandedRowKeys = [1, 2, 4, 5];
const enterKeyActions = ['startEdit', 'moveFocus'];
const enterKeyDirections = ['none', 'column', 'row'];

const onFocusedCellChanging = (e: TreeListTypes.FocusedCellChangingEvent) => {
  e.isHighlighted = true;
};

const App = () => {
  const [editOnKeyPress, setEditOnKeyPress] = React.useState(true);
  const [enterKeyAction, setEnterKeyAction] = React.useState<TreeListTypes.EnterKeyAction>('moveFocus');
  const [enterKeyDirection, setEnterKeyDirection] = React.useState<TreeListTypes.EnterKeyDirection>('column');

  return (
    <div id="tree-list-demo">
      <TreeList
        id="employees"
        dataSource={employees}
        keyExpr="ID"
        parentIdExpr="Head_ID"
        columnAutoWidth={true}
        defaultExpandedRowKeys={expandedRowKeys}
        onFocusedCellChanging={onFocusedCellChanging}>
        <KeyboardNavigation
          editOnKeyPress={editOnKeyPress}
          enterKeyAction={enterKeyAction}
          enterKeyDirection={enterKeyDirection} />
        <Editing
          mode="batch"
          allowUpdating={true}
          startEditAction="dblClick" />
        <Column
          dataField="Full_Name">
        </Column>
        <Column
          dataField="Prefix"
          caption="Title">
        </Column>
        <Column
          dataField="Title"
          caption="Position">
        </Column>
        <Column
          dataField="City">
        </Column>
        <Column
          dataField="Hire_Date"
          dataType="date">
        </Column>
      </TreeList>
      <div className="options">
        <div className="caption">Options</div>
        <div className="option-container">
          <div className="option check-box">
            <CheckBox text="Edit On Key Press"
              value={editOnKeyPress}
              onValueChange={setEditOnKeyPress} />
          </div>
          <div className="option">
            <span className="option-caption">Enter Key Action</span>
            <SelectBox className="select"
              items={enterKeyActions}
              value={enterKeyAction}
              onValueChange={setEnterKeyAction} />
          </div>
          <div className="option">
            <span className="option-caption">Enter Key Direction</span>
            <SelectBox className="select"
              items={enterKeyDirections}
              value={enterKeyDirection}
              onValueChange={setEnterKeyDirection} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
