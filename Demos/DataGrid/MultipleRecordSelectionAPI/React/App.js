import React from 'react';

import DataGrid, {
  Column,
  Selection,
  Toolbar,
  Item,
} from 'devextreme-react/data-grid';
import SelectBox from 'devextreme-react/select-box';
import Button from 'devextreme-react/button';
import { employees, titleLabel } from './data.js';

const titles = ['All', 'Dr.', 'Mr.', 'Mrs.', 'Ms.'];

class App extends React.Component {
  constructor(props) {
    super(props);

    this.dataGrid = null;
    this.selectionChangedBySelectBox = false;

    this.state = {
      prefix: '',
      selectedEmployeeNames: 'Nobody has been selected',
      selectedRowKeys: [],
    };

    this.onClearButtonClicked = this.onClearButtonClicked.bind(this);
    this.onSelectionChanged = this.onSelectionChanged.bind(this);
    this.onSelectionFilterChanged = this.onSelectionFilterChanged.bind(this);
  }

  render() {
    const {
      prefix, selectedRowKeys, selectedEmployeeNames,
    } = this.state;

    return (
      <div>
        <DataGrid
          id="grid-container"
          dataSource={employees}
          keyExpr="ID"
          onSelectionChanged={this.onSelectionChanged}
          ref={(ref) => { this.dataGrid = ref; }}
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
                onValueChanged={this.onSelectionFilterChanged}
                placeholder="Select title"
                width={150}
                value={prefix}
              />
            </Item>
            <Item location="before">
              <Button
                disabled={!selectedRowKeys.length}
                onClick={this.onClearButtonClicked}
                text="Clear Selection"
              />
            </Item>
          </Toolbar>
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
      selectedRowKeys,
    });
  }

  onClearButtonClicked() {
    this.dataGrid.instance.clearSelection();
  }

  onSelectionFilterChanged({ value }) {
    this.selectionChangedBySelectBox = true;

    const prefix = value;

    if (prefix) {
      const filteredEmployees = prefix === 'All' ? employees : employees.filter((employee) => employee.Prefix === prefix);
      const selectedRowKeys = filteredEmployees.map((employee) => employee.ID);

      this.setState({
        prefix,
        selectedRowKeys,
        selectedEmployeeNames: getEmployeeNames(filteredEmployees),
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
