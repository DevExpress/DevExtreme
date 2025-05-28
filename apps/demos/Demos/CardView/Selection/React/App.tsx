import React, { useState, useRef, useCallback } from 'react';
import CardView, { Column, CardCover, Selection } from 'devextreme-react/card-view';
import SelectBox  from 'devextreme-react/select-box';
import CheckBox  from 'devextreme-react/check-box';
import { employees, Employee } from './data.ts';

function altExpr({ FullName }: Employee): string {
  return `Photo of ${FullName}`;
}

function imageExpr({ FullName }: Employee): string {
  return `../../../../images/employees/new/${FullName}.jpg`;
}

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
    <div className="options">
      <div className="caption">Options</div>
      <div className="options-container">
        <div className="option">
          <span>Selection Mode</span>
          <SelectBox
            dataSource={['single', 'multiple']}
            value={selectionMode}
            onValueChange={onSelectionModeChange}
          ></SelectBox>
        </div>
        <div className="option">
          <span>Show Checkboxes Mode</span>
          <SelectBox
            dataSource={['always', 'none', 'onClick', 'onLongTap']}
            value={showCheckBoxesMode}
            onValueChange={setShowCheckBoxesMode}
            disabled={selectionMode !== 'multiple'}
          ></SelectBox>
        </div>
        <div className="option">
          <span>Allow Select All</span>
          <CheckBox
            value={allowSelectAll}
            onValueChange={setAllowSelectAll}
            disabled={selectionMode !== 'multiple'}
          ></CheckBox>
        </div>
        <div className="option">
          <span>Select All Mode</span>
          <SelectBox
            dataSource={['allPages', 'page']}
            value={selectAllMode}
            onValueChange={setSelectAllMode}
            disabled={selectionMode !== 'multiple' || !allowSelectAll}
          ></SelectBox>
        </div>
      </div>
    </div>
    <CardView
      dataSource={employees}
      keyExpr="ID"
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
