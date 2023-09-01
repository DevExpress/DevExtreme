import React from 'react';
import { TreeList, Selection, Column } from 'devextreme-react/tree-list';
import { CheckBox } from 'devextreme-react/check-box';
import { SelectBox } from 'devextreme-react/select-box';
import { employees, selectionModeLabel } from './data.js';

const expandedRowKeys = [1, 2, 10];
const emptySelectedText = 'Nobody has been selected';
const selectionModes = ['all', 'excludeRecursive', 'leavesOnly'];

const App = () => {
  const [selectedRowKeys, setSelectedRowKeys] = React.useState([]);
  const [recursive, setRecursive] = React.useState(false);
  const [selectionMode, setSelectionMode] = React.useState('all');
  const [selectedEmployeeNames, setSelectedEmployeeNames] = React.useState(emptySelectedText);

  const onSelectionChanged = React.useCallback((e) => {
    const selectedData = e.component.getSelectedRowsData(selectionMode);
    setSelectedRowKeys(e.selectedRowKeys);
    setSelectedEmployeeNames(getEmployeeNames(selectedData));
  }, [selectionMode, getEmployeeNames]);

  const onRecursiveChanged = React.useCallback((e) => {
    setRecursive(e.value);
    setSelectedRowKeys([]);
    setSelectedEmployeeNames(emptySelectedText);
  }, []);

  const onSelectionModeChanged = React.useCallback((e) => {
    setSelectionMode(e.value);
    setSelectedRowKeys([]);
    setSelectedEmployeeNames(emptySelectedText);
  }, []);

  const getEmployeeNames = React.useCallback((employeeList) => {
    if (employeeList.length > 0) {
      return employeeList.map((employee) => employee.Full_Name).join(', ');
    }
    return emptySelectedText;
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
