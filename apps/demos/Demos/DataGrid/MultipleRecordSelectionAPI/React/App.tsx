import React, { useCallback, useRef, useState } from 'react';
import DataGrid, {
  Column,
  Selection,
  Toolbar,
  Item,
} from 'devextreme-react/data-grid';
import SelectBox from 'devextreme-react/select-box';
import Button from 'devextreme-react/button';
import { Employee, employees, titleLabel } from './data.ts';

const titles = ['All', 'Dr.', 'Mr.', 'Mrs.', 'Ms.'];
const getEmployeeName = (row: Employee) => `${row.FirstName} ${row.LastName}`;
const getEmployeeNames = (selectedRowsData: Employee[]) => (selectedRowsData.length ? selectedRowsData.map(getEmployeeName).join(', ') : 'Nobody has been selected');

const App = () => {
  const [prefix, setPrefix] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedEmployeeNames, setSelectedEmployeeNames] = useState('Nobody has been selected');

  const dataGridRef = useRef<DataGrid>(null);

  const onClearButtonClicked = useCallback(() => {
    dataGridRef.current.instance.clearSelection();
  }, []);

  const onSelectionChanged = useCallback(
    ({ selectedRowKeys: changedRowKeys, selectedRowsData }) => {
      setPrefix(null);
      setSelectedRowKeys(changedRowKeys);
      setSelectedEmployeeNames(getEmployeeNames(selectedRowsData));
    }, [],
  );

  const onSelectionFilterChanged = useCallback(({ value }) => {
    const newPrefix = value;

    if (newPrefix) {
      const filteredEmployees = newPrefix === 'All' ? employees : employees.filter((employee) => employee.Prefix === newPrefix);
      const changedRowKeys = filteredEmployees.map((employee) => employee.ID);

      setPrefix(newPrefix);
      setSelectedRowKeys(changedRowKeys);
      setSelectedEmployeeNames(getEmployeeNames(filteredEmployees));
    }
  }, []);

  return (
    <div>
      <DataGrid
        id="grid-container"
        dataSource={employees}
        keyExpr="ID"
        onSelectionChanged={onSelectionChanged}
        ref={dataGridRef}
        selectedRowKeys={selectedRowKeys}
        showBorders={true}
      >
        <Selection mode="multiple" />
        <Column dataField="Prefix" caption="Title" width={70} />
        <Column dataField="FirstName" />
        <Column dataField="LastName" />
        <Column dataField="Position" width={180} />
        <Column dataField="BirthDate" dataType="date" width={125} />
        <Column dataField="HireDate" dataType="date" width={125} />
        <Toolbar>
          <Item location="before">
            <SelectBox
              dataSource={titles}
              inputAttr={titleLabel}
              onValueChanged={onSelectionFilterChanged}
              placeholder="Select title"
              width={150}
              value={prefix}
            />
          </Item>
          <Item location="before">
            <Button
              disabled={!selectedRowKeys.length}
              onClick={onClearButtonClicked}
              text="Clear Selection"
            />
          </Item>
        </Toolbar>
      </DataGrid>
      <div className="selected-data">
        <span className="caption">Selected Records:</span>{' '}
        <span>
          {selectedEmployeeNames}
        </span>
      </div>
    </div>
  );
};

export default App;
