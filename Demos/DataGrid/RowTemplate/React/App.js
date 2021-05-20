import React from 'react';
import DataGrid, { Column } from 'devextreme-react/data-grid';
import DataRow from './DataRow.js';

import service from './data.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.employees = service.getEmployees();
  }
  render() {
    return (
      <DataGrid id="gridContainer"
        dataSource={this.employees}
        keyExpr="ID"
        columnAutoWidth={true}
        showBorders={true}
        rowRender={DataRow}>
        <Column caption="Photo" width={100} allowFiltering={false} allowSorting={false} />
        <Column dataField="Prefix" width={70} caption="Title" />
        <Column dataField="FirstName" />
        <Column dataField="LastName" />
        <Column dataField="Position" />
        <Column dataField="BirthDate" dataType="date" />
        <Column dataField="HireDate" dataType="date" />
      </DataGrid>
    );
  }
}

export default App;
