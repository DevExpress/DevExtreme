import React from 'react';
import DataGrid, { Column } from 'devextreme-react/data-grid';

import service from './data.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.dataSource = service.getOrders();
  }
  render() {
    return (
      <div>
        <DataGrid
          id="gridContainer"
          dataSource={this.dataSource}
          keyExpr="ID"
          showBorders={true}>
          <Column dataField="OrderNumber" width={130} caption="Invoice Number" />
          <Column dataField="CustomerStoreCity" caption="City" hidingPriority={0} />
          <Column dataField="CustomerStoreState" caption="State" hidingPriority={1} />
          <Column dataField="Employee" />
          <Column dataField="OrderDate" dataType="date" hidingPriority={2} />
          <Column dataField="SaleAmount" format="currency" />
        </DataGrid>
      </div>
    );
  }
}

export default App;
