import React, { useCallback, useState } from 'react';

import SelectBox from 'devextreme-react/select-box';
import List, { type ListTypes } from 'devextreme-react/list';
import CheckBox from 'devextreme-react/check-box';

import { ArrayStore } from 'devextreme-react/common/data';

import {
  tasks,
  selectAllModeLabel,
  selectionModeLabel,
  selectByClickLabel,
} from './data.ts';

const dataSource = new ArrayStore({
  key: 'id',
  data: tasks,
});
const selectionModes: ListTypes.Properties['selectionMode'][] = ['none', 'single', 'multiple', 'all'];
const selectAllModes: ListTypes.Properties['selectAllMode'][] = ['page', 'allPages'];

export default function App() {
  const [selectionMode, setSelectionMode] = useState<ListTypes.Properties['selectionMode']>('all');
  const [selectAllMode, setSelectAllMode] = useState<ListTypes.Properties['selectAllMode']>('page');
  const [selectByClick, setSelectByClick] = useState<boolean>(false);
  const [selectedItemKeys, setSelectedItemKeys] = useState<[]>([]);

  const onSelectedItemKeysChange = useCallback(({ name, value }): void => {
    if (name === 'selectedItemKeys') {
      if (selectionMode !== 'none' || selectedItemKeys.length !== 0) {
        setSelectedItemKeys(value);
      }
    }
  }, [selectionMode, selectedItemKeys]);

  return (
    <>
      <div className="widget-container">
        <List
          dataSource={dataSource}
          height={400}
          showSelectionControls={true}
          selectionMode={selectionMode}
          selectAllMode={selectAllMode}
          selectedItemKeys={selectedItemKeys}
          selectByClick={selectByClick}
          onOptionChanged={onSelectedItemKeysChange}>
        </List>
        <div className="selected-data">
          <span className="caption">Selected IDs: </span>
          <span>{ selectedItemKeys.join(', ') }</span>
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
            onValueChange={setSelectionMode}>
          </SelectBox>
        </div>
        <div className="option">
          <span>Select All Mode</span>
            &nbsp;
          <SelectBox
            disabled={selectionMode !== 'all'}
            items={selectAllModes}
            inputAttr={selectAllModeLabel}
            value={selectAllMode}
            onValueChange={setSelectAllMode}>
          </SelectBox>
        </div>
        <div className="option">
          <span>Select By Click</span>
            &nbsp;
          <CheckBox
            value={selectByClick}
            elementAttr={selectByClickLabel}
            onValueChange={(value: boolean | null | undefined): void => setSelectByClick(!!value)}>
          </CheckBox>
        </div>
      </div>
    </>
  );
}
