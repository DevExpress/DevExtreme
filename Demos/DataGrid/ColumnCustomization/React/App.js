import React from 'react';
import DataGrid, { Column, ColumnChooser, ColumnFixing } from 'devextreme-react/data-grid';

import service from './data.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.employees = service.getEmployees();
  }
  calculateCellValue(data) {
    return [data.Title, data.FirstName, data.LastName].join(' ');
  }
  render() {
    return (
      <DataGrid
        id="gridContainer"
        dataSource={this.employees}
        keyExpr="ID"
        allowColumnReordering={true}
        allowColumnResizing={true}
        columnAutoWidth={true}
        showBorders={true}
      >
        <ColumnChooser enabled={true} />
        <ColumnFixing enabled={true} />
        <Column
          caption="Employee"
          width={230}
          fixed={true}
          calculateCellValue={this.calculateCellValue}
        />
        <Column
          dataField="BirthDate"
          dataType="date"
        />
        <Column
          dataField="HireDate"
          dataType="date"
        />
        <Column
          dataField="Position"
          alignment="right"
        />
        <Column
          dataField="Address"
          width={230}
        />
        <Column dataField="City" />
        <Column dataField="State" />
        <Column
          dataField="Zipcode"
          visible={false}
        />
        <Column dataField="HomePhone" />
        <Column dataField="MobilePhone" />
        <Column dataField="Skype" />
        <Column dataField="Email" />
      </DataGrid>
    );
  }
}

export default App;
