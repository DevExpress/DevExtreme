import React from 'react';
import RangeSelector, { Margin, Scale, Label, Behavior, Format } from 'devextreme-react/range-selector';
import DataGrid from 'devextreme-react/data-grid';
import { employees } from './data.js';

const columns = ['FirstName', 'LastName', 'BirthYear', 'City', 'Title'];

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedEmployees: employees
    };
    this.filterEmployees = this.filterEmployees.bind(this);
  }
  render() {
    return (
      <React.Fragment>
        <RangeSelector
          id="range-selector"
          title="Filter Employee List by Birth Year"
          dataSource={employees}
          dataSourceField="BirthYear"
          onValueChanged={this.filterEmployees}
        >
          <Margin top={20} />
          <Scale tickInterval={1} minorTickInterval={1}>
            <Label>
              <Format type="decimal" />
            </Label>
          </Scale>
          <Behavior callValueChanged="onMoving" />
        </RangeSelector>
        <h2 className="grid-header">Selected Employees</h2>
        <DataGrid
          dataSource={this.state.selectedEmployees}
          columns={columns}
          showBorders={true}
          columnAutoWidth={true}
        />
      </React.Fragment>
    );
  }
  filterEmployees({ value }) {
    this.setState({
      selectedEmployees: employees.filter(employee => employee.BirthYear >= value[0] && employee.BirthYear <= value[1] || !value.length)
    });
  }
}

export default App;
