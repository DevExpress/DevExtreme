import React, { useCallback, useState } from 'react';
import DataGrid, {
  Column,
  Editing,
  Paging,
  Lookup,
  KeyboardNavigation,
  DataGridTypes,
} from 'devextreme-react/data-grid';
import SelectBox, { SelectBoxTypes } from 'devextreme-react/select-box';
import CheckBox, { CheckBoxTypes } from 'devextreme-react/check-box';
import {
  employees,
  states,
  keyActionLabel,
  keyDirectionLabel,
} from './data.ts';

const enterKeyActions = ['startEdit', 'moveFocus'];
const enterKeyDirections = ['none', 'column', 'row'];

const onFocusedCellChanging = (e: { isHighlighted: boolean; }) => {
  e.isHighlighted = true;
};

const App = () => {
  const [editOnKeyPress, setEditOnKeyPress] = useState(true);
  const [enterKeyAction, setEnterKeyAction] = useState<DataGridTypes.EnterKeyAction>('moveFocus');
  const [enterKeyDirection, setEnterKeyDirection] = useState<DataGridTypes.EnterKeyDirection>('column');

  const editOnKeyPressChanged = useCallback((e: CheckBoxTypes.ValueChangedEvent) => {
    setEditOnKeyPress(e.value);
  }, []);

  const enterKeyActionChanged = useCallback((e: SelectBoxTypes.ValueChangedEvent) => {
    setEnterKeyAction(e.value);
  }, []);

  const enterKeyDirectionChanged = useCallback((e: SelectBoxTypes.ValueChangedEvent) => {
    setEnterKeyDirection(e.value);
  }, []);

  return (
    <div id="data-grid-demo">
      <DataGrid
        dataSource={employees}
        keyExpr="ID"
        showBorders={true}
        onFocusedCellChanging={onFocusedCellChanging}>
        <KeyboardNavigation
          editOnKeyPress={editOnKeyPress}
          enterKeyAction={enterKeyAction}
          enterKeyDirection={enterKeyDirection}
        />
        <Paging enabled={false} />
        <Editing mode="batch" allowUpdating={true} startEditAction="dblClick" />
        <Column dataField="Prefix" caption="Title" width={70} />
        <Column dataField="FirstName" />
        <Column dataField="LastName" />
        <Column dataField="Position" width={170} />
        <Column dataField="StateID" caption="State" width={125}>
          <Lookup dataSource={states} valueExpr="ID" displayExpr="Name" />
        </Column>
        <Column dataField="BirthDate" dataType="date" />
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
