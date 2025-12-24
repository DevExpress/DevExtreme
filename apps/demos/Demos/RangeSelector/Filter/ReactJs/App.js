import React, { useCallback, useState } from 'react';
import DataGrid from 'devextreme-react/data-grid';
import RangeSelector, {
  Behavior,
  Format,
  Label,
  Margin,
  Scale,
} from 'devextreme-react/range-selector';
import { employees } from './data.js';

const columns = ['FirstName', 'LastName', 'BirthYear', 'City', 'Title'];
const App = () => {
  const [selectedEmployees, setSelectedEmployees] = useState(employees);
  const filterEmployees = useCallback(
    ({ value }) => {
      setSelectedEmployees(
        employees.filter(
          (employee) =>
            (employee.BirthYear >= value[0] && employee.BirthYear <= value[1]) || !value.length,
        ),
      );
    },
    [setSelectedEmployees],
  );
  return (
    <>
      <RangeSelector
        id="range-selector"
        title="Filter Employee List by Birth Year"
        dataSource={employees}
        dataSourceField="BirthYear"
        onValueChanged={filterEmployees}
      >
        <Margin top={20} />
        <Scale
          tickInterval={1}
          minorTickInterval={1}
        >
          <Label>
            <Format type="decimal" />
          </Label>
        </Scale>
        <Behavior valueChangeMode="onHandleMove" />
      </RangeSelector>
      <h2 className="grid-header">Selected Employees</h2>
      <DataGrid
        dataSource={selectedEmployees}
        columns={columns}
        showBorders={true}
        columnAutoWidth={true}
      />
    </>
  );
};
export default App;
