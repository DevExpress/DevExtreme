import React, { useState, useRef, useCallback } from 'react';

import CardView, { Column, CardCover, Selection } from 'devextreme-react/card-view';
import type { CardViewRef } from 'devextreme-react/card-view';
import CheckBox from 'devextreme-react/check-box';
import type { CheckBoxTypes } from 'devextreme-react/check-box';
import type { SingleOrMultiple, SelectAllMode } from 'devextreme-react/common';
import type { SelectionColumnDisplayMode } from 'devextreme-react/common/grids';
import SelectBox from 'devextreme-react/select-box';

import { employees } from './data.ts';
import type { Employee } from './data.ts';

type CheckBoxValue = CheckBoxTypes.Properties['value'];

function altExpr({ FullName }: Employee): string {
  return `Photo of ${FullName}`;
}

function imageExpr({ FullName }: Employee): string {
  return `../../../../images/employees/new/${FullName}.jpg`;
}

const selectionModeLabel = { 'aria-label': 'Selection Mode' };
const showCheckBoxesModeLabel = { 'aria-label': 'Show Checkboxes Mode' };
const selectAllModeLabel = { 'aria-label': 'Select All Mode' };
const selectionModes: SingleOrMultiple[] = ['single', 'multiple'];
const showCheckBoxesModes: SelectionColumnDisplayMode[] = ['always', 'none', 'onClick', 'onLongTap'];
const selectAllModes: SelectAllMode[] = ['allPages', 'page'];
const defaultSelectedCardKeys = [4, 6];

const App = () => {
  const [selectionMode, setSelectionMode] = useState<SingleOrMultiple>('multiple');
  const [allowSelectAll, setAllowSelectAll] = useState<CheckBoxValue>(true);
  const [showCheckBoxesMode, setShowCheckBoxesMode] = useState<SelectionColumnDisplayMode>('always');
  const [selectAllMode, setSelectAllMode] = useState<SelectAllMode>('allPages');

  const cardViewRef = useRef<CardViewRef>(null);
  const isMultipleSelection = selectionMode === 'multiple';
  const isSelectAllDisabled = !isMultipleSelection || !allowSelectAll;
  const canSelectAll = !!allowSelectAll;

  const onSelectionModeChange = useCallback((value: SingleOrMultiple) => {
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
        <Column
          dataField="FullName"
        />
        <Column
          dataField="Position"
        />
        <Column
          dataField="Phone"
        />
        <Column
          dataField="Email"
        />
      </CardView>
    </>
  );
};

export default App;
