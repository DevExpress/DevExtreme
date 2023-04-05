import React from 'react';

import SelectBox from 'devextreme-react/select-box';
import List from 'devextreme-react/list';

import ArrayStore from 'devextreme/data/array_store';

import { tasks } from './data.js';

const dataSource = new ArrayStore({
  key: 'id',
  data: tasks,
});
const selectionModes = ['none', 'single', 'multiple', 'all'];
const selectAllModes = ['page', 'allPages'];

export default function App() {
  const [selectionMode, setSelectionMode] = React.useState('all');
  const [selectAllMode, setSelectAllMode] = React.useState('page');
  const [selectedItemKeys, setSelectedItemKeys] = React.useState([]);

  const onSelectedItemKeysChange = React.useCallback(({ name, value }) => {
    if (name === 'selectedItemKeys') {
      if (selectionMode !== 'none' || selectedItemKeys.length !== 0) {
        setSelectedItemKeys(value);
      }
    }
  }, [selectionMode, selectedItemKeys, setSelectedItemKeys]);

  const onSelectionModeChange = React.useCallback((value) => {
    setSelectionMode(value);
  }, [setSelectionMode]);

  const onSelectAllModeChange = React.useCallback((value) => {
    setSelectAllMode(value);
  }, [setSelectAllMode]);

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
            value={selectionMode}
            onValueChange={onSelectionModeChange}>
          </SelectBox>
        </div>
        <div className="option">
          <span>Select All Mode</span>
            &nbsp;
          <SelectBox
            disabled={selectionMode !== 'all'}
            items={selectAllModes}
            value={selectAllMode}
            onValueChange={onSelectAllModeChange}>
          </SelectBox>
        </div>
      </div>
    </React.Fragment>
  );
}
