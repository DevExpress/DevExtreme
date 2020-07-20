import React from 'react';

import DataGrid, {
  Column,
  Selection
} from 'devextreme-react/data-grid';
import SelectBox from 'devextreme-react/select-box';
import Button from 'devextreme-react/button';
import { employees } from './data.js';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.dataGrid = null;
    this.selectionChangedBySelectBox = false;

    this.state = {
      prefix: '',
      selectedEmployeeNames: 'Nobody has been selected',
      selectedRowKeys: []
    };

    this.onClearButtonClicked = this.onClearButtonClicked.bind(this);
    this.onSelectionChanged = this.onSelectionChanged.bind(this);
    this.onSelectionFilterChanged = this.onSelectionFilterChanged.bind(this);
  }

  render() {
    const { prefix, selectedRowKeys, selectedEmployeeNames } = this.state;

    return (
      <div id="grid">
        <SelectBox
          id="select-prefix"
          dataSource={['All', 'Dr.', 'Mr.', 'Mrs.', 'Ms.']}
          onValueChanged={this.onSelectionFilterChanged}
          placeholder="Select title"
          value={prefix}
        />{' '}
        <Button
          disabled={!selectedRowKeys.length}
          onClick={this.onClearButtonClicked}
          text="Clear Selection"
        />
        <DataGrid
          id="grid-container"
          dataSource={employees}
          keyExpr="ID"
          onSelectionChanged={this.onSelectionChanged}
          ref={ref => this.dataGrid = ref}
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
        </DataGrid>
        <div className="selected-data">
          <span className="caption">Selected Records:</span>{' '}
          <span>
            { selectedEmployeeNames }
          </span>
        </div>
      </div>
    );
  }

  onSelectionChanged({ selectedRowKeys, selectedRowsData }) {
    this.selectionChangedBySelectBox = false;

    this.setState({
      prefix: null,
      selectedEmployeeNames: getEmployeeNames(selectedRowsData),
      selectedRowKeys
    });
  }

  onClearButtonClicked() {
    this.dataGrid.instance.clearSelection();
  }

  async onSelectionFilterChanged({ value }) {
    this.selectionChangedBySelectBox = true;

    let prefix = value;

    if(prefix) {
      let filteredEmployees = prefix === 'All' ? employees : employees.filter(employee => employee.Prefix === prefix);

      const selectedRowKeys = filteredEmployees.map(employee => employee.ID);
      const selectedRowsData = await this.dataGrid.instance.getDataByKeys(selectedRowKeys);

      this.setState({
        prefix,
        selectedRowKeys,
        selectedEmployeeNames: getEmployeeNames(selectedRowsData)
      });
    }
  }
}

function getEmployeeName(row) {
  return `${row.FirstName} ${row.LastName}`;
}

function getEmployeeNames(selectedRowsData) {
  return selectedRowsData.length ? selectedRowsData.map(getEmployeeName).join(', ') : 'Nobody has been selected';
}

export default App;
