import React from 'react';
import DataGrid, { Column, Editing, Summary, TotalItem } from 'devextreme-react/data-grid';
import service from './data.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.orders = service.getOrders();
  }
  render() {
    return (
      <React.Fragment>
        <DataGrid
          id="gridContainer"
          dataSource={this.orders}
          keyExpr="ID"
          repaintChangesOnly={true}
          showBorders={true}>
          <Editing
            mode="batch"
            allowAdding={true}
            allowUpdating={true}
            allowDeleting={true}>
          </Editing>
          <Column dataField="OrderNumber" width={130} caption="Invoice Number" />
          <Column dataField="OrderDate" dataType="date" />
          <Column dataField="Employee" />
          <Column dataField="CustomerStoreCity" caption="City" />
          <Column dataField="CustomerStoreState" caption="State" />
          <Column dataField="SaleAmount" alignment="right" format="currency" editorOptions={{ format: 'currency' }} />
          <Summary recalculateWhileEditing={true}>
            <TotalItem
              column="OrderNumber"
              summaryType="count" />
            <TotalItem
              column="SaleAmount"
              summaryType="sum"
              valueFormat="currency" />
          </Summary>
        </DataGrid>
      </React.Fragment>
    );
  }
}

export default App;
