import React from 'react';
import DataGrid, {
  Column, Selection, Toolbar, Item,
} from 'devextreme-react/data-grid';
import SelectBox from 'devextreme-react/select-box';
import Button from 'devextreme-react/button';
import { employees, titleLabel } from './data.js';

const titles = ['All', 'Dr.', 'Mr.', 'Mrs.', 'Ms.'];
const getEmployeeName = (row) => `${row.FirstName} ${row.LastName}`;
const getEmployeeNames = (selectedRowsData) =>
  (selectedRowsData.length
    ? selectedRowsData.map(getEmployeeName).join(', ')
    : 'Nobody has been selected');
const App = () => {
  const [prefix, setPrefix] = React.useState('');
  const [selectedRowKeys, setSelectedRowKeys] = React.useState([]);
  const [selectedEmployeeNames, setSelectedEmployeeNames] = React.useState(
    'Nobody has been selected',
  );
  const dataGridRef = React.useRef(null);
  const onClearButtonClicked = React.useCallback(() => {
    dataGridRef.current.instance.clearSelection();
  }, []);
  const onSelectionChanged = React.useCallback(
    ({ selectedRowKeys: changedRowKeys, selectedRowsData }) => {
      setPrefix(null);
      setSelectedRowKeys(changedRowKeys);
      setSelectedEmployeeNames(getEmployeeNames(selectedRowsData));
    },
    [],
  );
  const onSelectionFilterChanged = React.useCallback(({ value }) => {
    const newPrefix = value;
    if (newPrefix) {
      const filteredEmployees = newPrefix === 'All'
        ? employees
        : employees.filter((employee) => employee.Prefix === newPrefix);
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
        <Column
          dataField="Prefix"
          caption="Title"
          width={70}
        />
        <Column dataField="FirstName" />
        <Column dataField="LastName" />
        <Column
          dataField="Position"
          width={180}
        />
        <Column
          dataField="BirthDate"
          dataType="date"
          width={125}
        />
        <Column
          dataField="HireDate"
          dataType="date"
          width={125}
        />
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
        <span className="caption">Selected Records:</span> <span>{selectedEmployeeNames}</span>
      </div>
    </div>
  );
};
export default App;
