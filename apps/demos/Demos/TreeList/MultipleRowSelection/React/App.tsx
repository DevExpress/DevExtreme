import React, { useCallback, useState } from 'react';
import {
  TreeList, Selection, Column, TreeListTypes,
} from 'devextreme-react/tree-list';
import { CheckBox, CheckBoxTypes } from 'devextreme-react/check-box';
import { SelectBox, SelectBoxTypes } from 'devextreme-react/select-box';
import { employees, selectionModeLabel } from './data.ts';

const expandedRowKeys = [1, 2, 10];
const emptySelectedText = 'Nobody has been selected';
const selectionModes = ['all', 'excludeRecursive', 'leavesOnly'];

const App = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [recursive, setRecursive] = useState(false);
  const [selectionMode, setSelectionMode] = useState('all');
  const [selectedEmployeeNames, setSelectedEmployeeNames] = useState(emptySelectedText);

  const getEmployeeNames = useCallback((employeeList) => {
    if (employeeList.length > 0) {
      return employeeList.map((employee) => employee.Full_Name).join(', ');
    }
    return emptySelectedText;
  }, []);

  const onSelectionChanged = useCallback((e: TreeListTypes.SelectionChangedEvent) => {
    const selectedData = e.component.getSelectedRowsData(selectionMode);
    setSelectedRowKeys(e.selectedRowKeys);
    setSelectedEmployeeNames(getEmployeeNames(selectedData));
  }, [selectionMode, getEmployeeNames]);

  const onRecursiveChanged = useCallback((e: CheckBoxTypes.ValueChangedEvent) => {
    setRecursive(e.value);
    setSelectedRowKeys([]);
    setSelectedEmployeeNames(emptySelectedText);
  }, []);

  const onSelectionModeChanged = useCallback((e: SelectBoxTypes.ValueChangedEvent) => {
    setSelectionMode(e.value);
    setSelectedRowKeys([]);
    setSelectedEmployeeNames(emptySelectedText);
  }, []);

  return (
    <div>
      <TreeList
        id="employees"
        dataSource={employees}
        showRowLines={true}
        showBorders={true}
        columnAutoWidth={true}
        defaultExpandedRowKeys={expandedRowKeys}
        selectedRowKeys={selectedRowKeys}
        keyExpr="ID"
        parentIdExpr="Head_ID"
        onSelectionChanged={onSelectionChanged}
      >
        <Selection recursive={recursive} mode="multiple" />
        <Column dataField="Full_Name" />
        <Column dataField="Title" caption="Position" />
        <Column dataField="City" />
        <Column dataField="State" />
        <Column width={120} dataField="Hire_Date" dataType="date" />
      </TreeList>
      <div className="options">
        <div className="caption">Options</div>
        <div className="option">
          <span>Selection Mode</span>{' '}
          <SelectBox
            value={selectionMode}
            items={selectionModes}
            inputAttr={selectionModeLabel}
            text="Recursive Selection"
            onValueChanged={onSelectionModeChanged}
          />
        </div>
        <div className="option">
          <CheckBox
            value={recursive}
            text="Recursive Selection"
            onValueChanged={onRecursiveChanged}
          />
        </div>
        <div className="selected-data">
          <span className="caption">Selected Records:</span>{' '}
          <span>
            { selectedEmployeeNames }
          </span>
        </div>
      </div>
    </div>
  );
};

export default App;
