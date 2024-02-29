import React, { useCallback, useState } from 'react';
import SelectBox from 'devextreme-react/select-box';
import List from 'devextreme-react/list';
import CheckBox from 'devextreme-react/check-box';
import ArrayStore from 'devextreme/data/array_store';
import {
  tasks, selectAllModeLabel, selectionModeLabel, selectByClickLabel,
} from './data.js';

const dataSource = new ArrayStore({
  key: 'id',
  data: tasks,
});
const selectionModes = ['none', 'single', 'multiple', 'all'];
const selectAllModes = ['page', 'allPages'];
export default function App() {
  const [selectionMode, setSelectionMode] = useState('all');
  const [selectAllMode, setSelectAllMode] = useState('page');
  const [selectByClick, setSelectByClick] = useState(false);
  const [selectedItemKeys, setSelectedItemKeys] = useState([]);
  const onSelectedItemKeysChange = useCallback(
    ({ name, value }) => {
      if (name === 'selectedItemKeys') {
        if (selectionMode !== 'none' || selectedItemKeys.length !== 0) {
          setSelectedItemKeys(value);
        }
      }
    },
    [selectionMode, selectedItemKeys, setSelectedItemKeys],
  );
  const onSelectionModeChange = useCallback(
    (value) => {
      setSelectionMode(value);
    },
    [setSelectionMode],
  );
  const onSelectAllModeChange = useCallback(
    (value) => {
      setSelectAllMode(value);
    },
    [setSelectAllMode],
  );
  const onSelectByClickChange = useCallback(
    (value) => {
      setSelectByClick(value);
    },
    [setSelectByClick],
  );
  return (
    <React.Fragment>
      <div className="widget-container">
        <List
          dataSource={dataSource}
          height={400}
          showSelectionControls={true}
          selectionMode={selectionMode}
          selectAllMode={selectAllMode}
          selectedItemKeys={selectedItemKeys}
          selectByClick={selectByClick}
          onOptionChanged={onSelectedItemKeysChange}
        ></List>
        <div className="selected-data">
          <span className="caption">Selected IDs: </span>
          <span>{selectedItemKeys.join(', ')}</span>
        </div>
      </div>
      <div className="options">
        <div className="caption">Options</div>
        <div className="option">
          <span>Selection Mode</span>
          &nbsp;
          <SelectBox
            items={selectionModes}
            inputAttr={selectionModeLabel}
            value={selectionMode}
            onValueChange={onSelectionModeChange}
          ></SelectBox>
        </div>
        <div className="option">
          <span>Select All Mode</span>
          &nbsp;
          <SelectBox
            disabled={selectionMode !== 'all'}
            items={selectAllModes}
            inputAttr={selectAllModeLabel}
            value={selectAllMode}
            onValueChange={onSelectAllModeChange}
          ></SelectBox>
        </div>
        <div className="option">
          <span>Select By Click</span>
          &nbsp;
          <CheckBox
            value={selectByClick}
            elementAttr={selectByClickLabel}
            onValueChange={onSelectByClickChange}
          ></CheckBox>
        </div>
      </div>
    </React.Fragment>
  );
}
