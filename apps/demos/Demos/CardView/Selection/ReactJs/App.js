import React, { useState, useRef, useCallback } from 'react';
import CardView, { Column, CardCover, Selection } from 'devextreme-react/card-view';
import CheckBox from 'devextreme-react/check-box';
import SelectBox from 'devextreme-react/select-box';
import { employees } from './data.js';

function altExpr({ FullName }) {
  return `Photo of ${FullName}`;
}
function imageExpr({ FullName }) {
  return `../../../../images/employees/new/${FullName}.jpg`;
}
const selectionModeLabel = { 'aria-label': 'Selection Mode' };
const showCheckBoxesModeLabel = { 'aria-label': 'Show Checkboxes Mode' };
const selectAllModeLabel = { 'aria-label': 'Select All Mode' };
const selectionModes = ['single', 'multiple'];
const showCheckBoxesModes = ['always', 'none', 'onClick', 'onLongTap'];
const selectAllModes = ['allPages', 'page'];
const defaultSelectedCardKeys = [4, 6];
const App = () => {
  const [selectionMode, setSelectionMode] = useState('multiple');
  const [allowSelectAll, setAllowSelectAll] = useState(true);
  const [showCheckBoxesMode, setShowCheckBoxesMode] = useState('always');
  const [selectAllMode, setSelectAllMode] = useState('allPages');
  const cardViewRef = useRef(null);
  const isMultipleSelection = selectionMode === 'multiple';
  const isSelectAllDisabled = !isMultipleSelection || !allowSelectAll;
  const canSelectAll = !!allowSelectAll;
  const onSelectionModeChange = useCallback((value) => {
    setSelectionMode(value);
    cardViewRef.current?.instance().clearSelection();
  }, []);
  return (
    <>
      <div className="options-panel">
        <div className="caption">Options</div>
        <div className="options-container">
          <div className="option">
            <span>Selection Mode</span>
            <SelectBox
              inputAttr={selectionModeLabel}
              dataSource={selectionModes}
              value={selectionMode}
              onValueChange={onSelectionModeChange}
            ></SelectBox>
          </div>
          <div className="option">
            <span>Show Checkboxes Mode</span>
            <SelectBox
              inputAttr={showCheckBoxesModeLabel}
              dataSource={showCheckBoxesModes}
              value={showCheckBoxesMode}
              onValueChange={setShowCheckBoxesMode}
              disabled={!isMultipleSelection}
            ></SelectBox>
          </div>
          <div className="option">
            <span>Select All Mode</span>
            <SelectBox
              inputAttr={selectAllModeLabel}
              dataSource={selectAllModes}
              value={selectAllMode}
              onValueChange={setSelectAllMode}
              disabled={isSelectAllDisabled}
            ></SelectBox>
          </div>
          <div className="option">
            <CheckBox
              text="Allow Select All"
              value={allowSelectAll}
              onValueChange={setAllowSelectAll}
              disabled={!isMultipleSelection}
            ></CheckBox>
          </div>
        </div>
      </div>
      <CardView
        dataSource={employees}
        keyExpr="ID"
        cardsPerRow="auto"
        cardMinWidth={300}
        defaultSelectedCardKeys={defaultSelectedCardKeys}
        ref={cardViewRef}
      >
        <CardCover
          altExpr={altExpr}
          imageExpr={imageExpr}
        />
        <Selection
          mode={selectionMode}
          showCheckBoxesMode={showCheckBoxesMode}
          allowSelectAll={canSelectAll}
          selectAllMode={selectAllMode}
        />
        <Column dataField="FullName" />
        <Column dataField="Position" />
        <Column dataField="Phone" />
        <Column dataField="Email" />
      </CardView>
    </>
  );
};
export default App;
