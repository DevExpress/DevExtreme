import React, { useState, useRef, useCallback } from 'react';
import CardView, { Column, CardCover, Selection } from 'devextreme-react/card-view';
import SelectBox from 'devextreme-react/select-box';
import CheckBox from 'devextreme-react/check-box';
import { employees } from './data.js';

function altExpr({ FullName }) {
  return `Photo of ${FullName}`;
}
function imageExpr({ FullName }) {
  return `../../../../images/employees/new/${FullName}.jpg`;
}
const App = () => {
  const [selectionMode, setSelectionMode] = useState('multiple');
  const [allowSelectAll, setAllowSelectAll] = useState(true);
  const [showCheckBoxesMode, setShowCheckBoxesMode] = useState('always');
  const [selectAllMode, setSelectAllMode] = useState('allPages');
  const cardViewRef = useRef(null);
  const onSelectionModeChange = useCallback((value) => {
    setSelectionMode(value);
    cardViewRef.current.instance().clearSelection();
  }, []);
  return (
    <React.Fragment>
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
        <Column dataField="FullName" />
        <Column dataField="Position" />
        <Column dataField="Phone" />
        <Column dataField="Email" />
      </CardView>
    </React.Fragment>
  );
};
export default App;
