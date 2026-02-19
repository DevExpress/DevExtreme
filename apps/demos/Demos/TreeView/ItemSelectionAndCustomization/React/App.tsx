import React, { useCallback, useRef, useState } from 'react';
import TreeView from 'devextreme-react/tree-view';
import type { TreeViewTypes, TreeViewRef } from 'devextreme-react/tree-view';
import List from 'devextreme-react/list';
import SelectBox, { type SelectBoxTypes } from 'devextreme-react/select-box';
import CheckBox, { type CheckBoxTypes } from 'devextreme-react/check-box';

import {
  employees,
  showCheckboxesModeLabel,
  selectionModeLabel,
  disabledNodeSelectionModeLabel,
} from './data.ts';
import type { Employee } from './types';

const showCheckBoxesModes: TreeViewTypes.TreeViewCheckBoxMode[] = ['normal', 'selectAll', 'none'];
const selectionModes: TreeViewTypes.SingleOrMultiple[] = ['multiple', 'single'];
const disabledNodeSelectionModes: TreeViewTypes.DisabledNodeSelectionMode[] = ['never', 'recursiveAndAll'];

const renderTreeViewItem = (item: Employee): string => `${item.fullName} (${item.position})`;

const renderListItem = (item: Employee): string => `${item.prefix} ${item.fullName} (${item.position})`;

const App = () => {
  const treeViewRef = useRef<TreeViewRef<Employee>>(null);
  const [selectedEmployees, setSelectedEmployees] = useState<(Employee | undefined)[]>([]);
  const [selectNodesRecursive, setSelectNodesRecursive] = useState<boolean>(true);
  const [selectByClick, setSelectByClick] = useState<boolean>(false);
  const [showCheckBoxesMode, setShowCheckBoxesMode] = useState<TreeViewTypes.TreeViewCheckBoxMode>(showCheckBoxesModes[0]);
  const [selectionMode, setSelectionMode] = useState<TreeViewTypes.SingleOrMultiple>(selectionModes[0]);
  const [disabledNodeSelectionMode, setDisabledNodeSelectionMode] = useState<TreeViewTypes.DisabledNodeSelectionMode>(disabledNodeSelectionModes[0]);
  const [isSelectionModeDisabled, setIsSelectionModeDisabled] = useState<boolean>(false);
  const [isRecursiveDisabled, setIsRecursiveDisabled] = useState<boolean>(false);

  const syncSelection = useCallback((treeView: ReturnType<TreeViewRef<Employee>['instance']>): void => {
    const syncSelectedEmployees = treeView.getSelectedNodes()
      .map((node: TreeViewTypes.Node<Employee>): Employee | undefined => node.itemData);

    setSelectedEmployees(syncSelectedEmployees);
  }, []);

  const treeViewSelectionChanged = useCallback((e: TreeViewTypes.SelectionChangedEvent<Employee>): void => {
    syncSelection(e.component);
  }, [syncSelection]);

  const treeViewContentReady = useCallback((e: TreeViewTypes.ContentReadyEvent<Employee>): void => {
    syncSelection(e.component);
  }, [syncSelection]);

  const showCheckBoxesModeValueChanged = useCallback((e: SelectBoxTypes.ValueChangedEvent): void => {
    const value = e.value;
    setShowCheckBoxesMode(value);

    if (value === 'selectAll') {
      setSelectionMode('multiple');
      setIsRecursiveDisabled(false);
    }
    setIsSelectionModeDisabled(value === 'selectAll');
  }, []);

  const selectionModeValueChanged = useCallback((e: SelectBoxTypes.ValueChangedEvent): void => {
    const value = e.value;
    setSelectionMode(value);

    if (value === 'single') {
      setSelectNodesRecursive(false);
      treeViewRef.current?.instance().unselectAll();
    }
    setIsRecursiveDisabled(value === 'single');
  }, []);

  const disabledNodeSelectionModeValueChanged = useCallback((e: SelectBoxTypes.ValueChangedEvent): void => {
    setDisabledNodeSelectionMode(e.value);
  }, []);

  const selectNodesRecursiveValueChanged = useCallback((e: CheckBoxTypes.ValueChangedEvent): void => {
    setSelectNodesRecursive(e.value);
  }, []);

  const selectByClickValueChanged = useCallback((e: CheckBoxTypes.ValueChangedEvent): void => {
    setSelectByClick(e.value);
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
          selectNodesRecursive={selectNodesRecursive}
          selectByClick={selectByClick}
          showCheckBoxesMode={showCheckBoxesMode}
          selectionMode={selectionMode}
          disabledNodeSelectionMode={disabledNodeSelectionMode}
          onSelectionChanged={treeViewSelectionChanged}
          onContentReady={treeViewContentReady}
          itemRender={renderTreeViewItem}
        />
        {' '}
        <div className="selected-container">Selected employees
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
              <span>Show Check Boxes Mode:</span>
              <div className="editor-container">
                <SelectBox
                  items={showCheckBoxesModes}
                  value={showCheckBoxesMode}
                  inputAttr={showCheckboxesModeLabel}
                  onValueChanged={showCheckBoxesModeValueChanged} />
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
                  onValueChanged={selectionModeValueChanged} />
              </div>
            </div>
            <div className="option">
              <span>Disabled Node Selection Mode:</span>
              <div className="editor-container">
                <SelectBox
                  items={disabledNodeSelectionModes}
                  value={disabledNodeSelectionMode}
                  inputAttr={disabledNodeSelectionModeLabel}
                  onValueChanged={disabledNodeSelectionModeValueChanged} />
              </div>
            </div>
          </div>
          <div className="options-section">
            <div className="option">
              <div className="caption-placeholder">&nbsp;</div>
              <div className="editor-container">
                <CheckBox
                  text="Select Nodes Recursive"
                  value={selectNodesRecursive}
                  disabled={isRecursiveDisabled}
                  onValueChanged={selectNodesRecursiveValueChanged} />
              </div>
            </div>
            <div className="option">
              <div className="caption-placeholder">&nbsp;</div>
              <div className="editor-container">
                <CheckBox
                  text="Select By Click"
                  value={selectByClick}
                  onValueChanged={selectByClickValueChanged} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
