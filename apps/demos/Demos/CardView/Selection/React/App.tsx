import React, { useState, useRef, useCallback } from 'react';
import CardView, { Column, CardCover, Selection } from 'devextreme-react/card-view';
import SelectBox from 'devextreme-react/select-box';
import CheckBox from 'devextreme-react/check-box';
import { employees, Employee } from './data.ts';

function altExpr({ FullName }: Employee): string {
  return `Photo of ${FullName}`;
}

function imageExpr({ FullName }: Employee): string {
  return `../../../../images/employees/new/${FullName}.jpg`;
}

const selectionModeLabel = { 'aria-label': 'Selection Mode' };
const showCheckBoxesModeLabel = { 'aria-label': 'Show Checkboxes Mode' };
const selectAllModeLabel = { 'aria-label': 'Select All Mode' };

const App = () => {
  const [selectionMode, setSelectionMode] = useState<'single' | 'multiple'>('multiple');
  const [allowSelectAll, setAllowSelectAll] = useState(true);
  const [showCheckBoxesMode, setShowCheckBoxesMode] = useState<'always' | 'none' | 'onClick' | 'onLongTap'>('always');
  const [selectAllMode, setSelectAllMode] = useState<'allPages' | 'page'>('allPages');

  const cardViewRef = useRef(null);

  const onSelectionModeChange = useCallback((value) => {
    setSelectionMode(value);
    cardViewRef.current!.instance().clearSelection();
  }, []);

  return <>
    <div className="options-panel">
      <div className="caption">Options</div>
      <div className="options-container">
        <div className="option">
          <span>Selection Mode</span>
          <SelectBox
            inputAttr={selectionModeLabel}
            dataSource={['single', 'multiple']}
            value={selectionMode}
            onValueChange={onSelectionModeChange}
          ></SelectBox>
        </div>
        <div className="option">
          <span>Show Checkboxes Mode</span>
          <SelectBox
            inputAttr={showCheckBoxesModeLabel}
            dataSource={['always', 'none', 'onClick', 'onLongTap']}
            value={showCheckBoxesMode}
            onValueChange={setShowCheckBoxesMode}
            disabled={selectionMode !== 'multiple'}
          ></SelectBox>
        </div>
        <div className="option">
          <span>Select All Mode</span>
          <SelectBox
            inputAttr={selectAllModeLabel}
            dataSource={['allPages', 'page']}
            value={selectAllMode}
            onValueChange={setSelectAllMode}
            disabled={selectionMode !== 'multiple' || !allowSelectAll}
          ></SelectBox>
        </div>
        <div className="option">
          <CheckBox
            text={'Allow Select All'}
            value={allowSelectAll}
            onValueChange={setAllowSelectAll}
            disabled={selectionMode !== 'multiple'}
          ></CheckBox>
        </div>
      </div>
    </div>
    <CardView
      dataSource={employees}
      keyExpr="ID"
      cardsPerRow="auto"
      cardMinWidth={300}
      defaultSelectedCardKeys={[4, 6]}
      ref={cardViewRef}
    >
      <CardCover
        altExpr={altExpr}
        imageExpr={imageExpr}
      />
      <Selection
        mode={selectionMode}
        showCheckBoxesMode={showCheckBoxesMode}
        allowSelectAll={allowSelectAll}
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
  </>;
};

export default App;
