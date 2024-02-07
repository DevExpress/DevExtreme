import React, { useCallback, useState } from 'react';
import DataGrid, {
  Column,
  Editing,
  Paging,
  Lookup,
  KeyboardNavigation,
} from 'devextreme-react/data-grid';
import SelectBox from 'devextreme-react/select-box';
import CheckBox from 'devextreme-react/check-box';
import {
  employees, states, keyActionLabel, keyDirectionLabel,
} from './data.js';

const enterKeyActions = ['startEdit', 'moveFocus'];
const enterKeyDirections = ['none', 'column', 'row'];
const onFocusedCellChanging = (e) => {
  e.isHighlighted = true;
};
const App = () => {
  const [editOnKeyPress, setEditOnKeyPress] = useState(true);
  const [enterKeyAction, setEnterKeyAction] = useState('moveFocus');
  const [enterKeyDirection, setEnterKeyDirection] = useState('column');
  const editOnKeyPressChanged = useCallback((e) => {
    setEditOnKeyPress(e.value);
  }, []);
  const enterKeyActionChanged = useCallback((e) => {
    setEnterKeyAction(e.value);
  }, []);
  const enterKeyDirectionChanged = useCallback((e) => {
    setEnterKeyDirection(e.value);
  }, []);
  return (
    <div id="data-grid-demo">
      <DataGrid
        dataSource={employees}
        keyExpr="ID"
        showBorders={true}
        onFocusedCellChanging={onFocusedCellChanging}
      >
        <KeyboardNavigation
          editOnKeyPress={editOnKeyPress}
          enterKeyAction={enterKeyAction}
          enterKeyDirection={enterKeyDirection}
        />
        <Paging enabled={false} />
        <Editing
          mode="batch"
          allowUpdating={true}
          startEditAction="dblClick"
        />
        <Column
          dataField="Prefix"
          caption="Title"
          width={70}
        />
        <Column dataField="FirstName" />
        <Column dataField="LastName" />
        <Column
          dataField="Position"
          width={170}
        />
        <Column
          dataField="StateID"
          caption="State"
          width={125}
        >
          <Lookup
            dataSource={states}
            valueExpr="ID"
            displayExpr="Name"
          />
        </Column>
        <Column
          dataField="BirthDate"
          dataType="date"
        />
      </DataGrid>
      <div className="options">
        <div className="caption">Options</div>
        <div className="option-container">
          <div className="option check-box">
            <CheckBox
              text="Edit On Key Press"
              value={editOnKeyPress}
              onValueChanged={editOnKeyPressChanged}
            />
          </div>
          <div className="option">
            <span className="option-caption">Enter Key Action</span>
            <SelectBox
              className="select"
              items={enterKeyActions}
              inputAttr={keyActionLabel}
              value={enterKeyAction}
              onValueChanged={enterKeyActionChanged}
            />
          </div>
          <div className="option">
            <span className="option-caption">Enter Key Direction</span>
            <SelectBox
              className="select"
              items={enterKeyDirections}
              inputAttr={keyDirectionLabel}
              value={enterKeyDirection}
              onValueChanged={enterKeyDirectionChanged}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default App;
