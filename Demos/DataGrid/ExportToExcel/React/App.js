import React from 'react';
import DataGrid, { Column, Export, Selection, GroupPanel } from 'devextreme-react/data-grid';

import service from './data.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.dataSource = service.getEmployees();
  }
  render() {
    return (
      <div>
        <DataGrid
          id="gridContainer"
          dataSource={this.dataSource}
          keyExpr="ID"
          showBorders={true}>
          <Export enabled={true} fileName="Employees" allowExportSelectedData={true} />
          <Selection mode="multiple" />
          <GroupPanel visible={true} />
          <Column dataField="Prefix" width={60} caption="Title" />
          <Column dataField="FirstName" />
          <Column dataField="LastName" />
          <Column dataField="City" />
          <Column dataField="State" />
          <Column dataField="Position" width={130} />
          <Column dataField="BirthDate" width={100} dataType="date" />
          <Column dataField="HireDate" width={100} dataType="date" />
        </DataGrid>
      </div>
    );
  }
}

export default App;
