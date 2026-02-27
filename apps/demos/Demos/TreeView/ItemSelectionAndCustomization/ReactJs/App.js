import React, { useCallback, useRef, useState } from 'react';
import TreeView from 'devextreme-react/tree-view';
import List from 'devextreme-react/list';
import SelectBox from 'devextreme-react/select-box';
import CheckBox from 'devextreme-react/check-box';
import {
  employees,
  checkboxVisibilityLabel,
  selectionModeLabel,
  disabledNodeSelectionModeLabel,
} from './data.js';

const checkboxVisibilityOptions = ['normal', 'selectAll', 'none'];
const selectionModes = ['multiple', 'single'];
const disabledNodeSelectionModes = ['never', 'recursiveAndAll'];
const renderTreeViewItem = (item) => `${item.fullName} (${item.position})`;
const renderListItem = (item) => `${item.prefix} ${item.fullName} (${item.position})`;
const App = () => {
  const treeViewRef = useRef(null);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [recursiveSelection, setRecursiveSelection] = useState(true);
  const [selectOnClick, setSelectOnClick] = useState(false);
  const [checkboxVisibility, setCheckboxVisibility] = useState(checkboxVisibilityOptions[0]);
  const [selectionMode, setSelectionMode] = useState(selectionModes[0]);
  const [disabledNodeSelectionMode, setDisabledNodeSelectionMode] = useState(
    disabledNodeSelectionModes[0],
  );
  const [isSelectionModeDisabled, setIsSelectionModeDisabled] = useState(false);
  const [isRecursiveDisabled, setIsRecursiveDisabled] = useState(false);
  const syncSelection = useCallback((treeView) => {
    const syncSelectedEmployees = treeView.getSelectedNodes().map((node) => node.itemData);
    setSelectedEmployees(syncSelectedEmployees);
  }, []);
  const treeViewSelectionChanged = useCallback(
    (e) => {
      syncSelection(e.component);
    },
    [syncSelection],
  );
  const treeViewContentReady = useCallback(
    (e) => {
      syncSelection(e.component);
    },
    [syncSelection],
  );
  const checkboxVisibilityValueChanged = useCallback((e) => {
    const value = e.value;
    setCheckboxVisibility(value);
    if (value === 'selectAll') {
      setSelectionMode('multiple');
      setIsRecursiveDisabled(false);
    }
    setIsSelectionModeDisabled(value === 'selectAll');
  }, []);
  const selectionModeValueChanged = useCallback((e) => {
    const value = e.value;
    setSelectionMode(value);
    if (value === 'single') {
      setRecursiveSelection(false);
      treeViewRef.current?.instance().unselectAll();
    }
    setIsRecursiveDisabled(value === 'single');
  }, []);
  const disabledNodeSelectionModeValueChanged = useCallback((e) => {
    setDisabledNodeSelectionMode(e.value);
  }, []);
  const recursiveSelectionValueChanged = useCallback((e) => {
    setRecursiveSelection(e.value);
  }, []);
  const selectOnClickValueChanged = useCallback((e) => {
    setSelectOnClick(e.value);
  }, []);
  return (
    <div>
      <div className="form">
        <h4>Employees</h4>
        <TreeView
          id="treeview"
          ref={treeViewRef}
          width={340}
          height={320}
          items={employees}
          selectNodesRecursive={recursiveSelection}
          selectByClick={selectOnClick}
          showCheckBoxesMode={checkboxVisibility}
          selectionMode={selectionMode}
          disabledNodeSelectionMode={disabledNodeSelectionMode}
          onSelectionChanged={treeViewSelectionChanged}
          onContentReady={treeViewContentReady}
          itemRender={renderTreeViewItem}
        />{' '}
        <div className="selected-container">
          Selected employees
          <List
            id="selected-employees"
            width={400}
            height={200}
            showScrollbar="always"
            items={selectedEmployees}
            itemRender={renderListItem}
          />
        </div>
      </div>
      <div className="options">
        <div className="caption">Options</div>
        <div className="options-container">
          <div className="options-section">
            <div className="option">
              <span>Checkbox Visibility:</span>
              <div className="editor-container">
                <SelectBox
                  items={checkboxVisibilityOptions}
                  value={checkboxVisibility}
                  inputAttr={checkboxVisibilityLabel}
                  onValueChanged={checkboxVisibilityValueChanged}
                />
              </div>
            </div>
            <div className="option">
              <span>Selection Mode:</span>
              <div className="editor-container">
                <SelectBox
                  items={selectionModes}
                  value={selectionMode}
                  inputAttr={selectionModeLabel}
                  disabled={isSelectionModeDisabled}
                  onValueChanged={selectionModeValueChanged}
                />
              </div>
            </div>
            <div className="option">
              <span>Disabled Node Selection Mode:</span>
              <div className="editor-container">
                <SelectBox
                  items={disabledNodeSelectionModes}
                  value={disabledNodeSelectionMode}
                  inputAttr={disabledNodeSelectionModeLabel}
                  onValueChanged={disabledNodeSelectionModeValueChanged}
                />
              </div>
            </div>
          </div>
          <div className="options-section">
            <div className="option">
              <div className="caption-placeholder">&nbsp;</div>
              <div className="editor-container">
                <CheckBox
                  text="Recursive Selection"
                  value={recursiveSelection}
                  disabled={isRecursiveDisabled}
                  onValueChanged={recursiveSelectionValueChanged}
                />
              </div>
            </div>
            <div className="option">
              <div className="caption-placeholder">&nbsp;</div>
              <div className="editor-container">
                <CheckBox
                  text="Select on Click"
                  value={selectOnClick}
                  onValueChanged={selectOnClickValueChanged}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default App;
