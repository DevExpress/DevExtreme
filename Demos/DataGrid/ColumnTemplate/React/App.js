import React from 'react';
import DataGrid, { Column } from 'devextreme-react/data-grid';

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
        showBorders={true}
      >
        <Column dataField="Picture"
          width={100}
          allowSorting={false}
          cellRender={cellRender}
        />
        <Column dataField="Prefix"
          width={70}
          caption="Title"
        />
        <Column dataField="FirstName" />
        <Column dataField="LastName" />
        <Column dataField="Position" />
        <Column dataField="BirthDate" dataType="date" />
        <Column dataField="HireDate" dataType="date" />
      </DataGrid>
    );
  }
}

function cellRender(data) {
  return <img src={data.value} />;
}

export default App;
