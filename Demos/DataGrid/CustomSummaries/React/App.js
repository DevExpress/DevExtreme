import React from 'react';
import DataGrid, { Column, Selection, Paging, Summary, TotalItem } from 'devextreme-react/data-grid';
import service from './data.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.orders = service.getOrders();
  }
  calculateSelectedRow(options) {
    if (options.name === 'SelectedRowsSummary') {
      if (options.summaryProcess === 'start') {
        options.totalValue = 0;
      } else if (options.summaryProcess === 'calculate') {
        if (options.component.isRowSelected(options.value.ID)) {
          options.totalValue = options.totalValue + options.value.SaleAmount;
        }
      }
    }
  }
  onSelectionChanged(e) {
    e.component.refresh(true);
  }
  render() {
    return (
      <React.Fragment>
        <DataGrid
          id="gridContainer"
          defaultSelectedRowKeys={[1, 4, 7]}
          onSelectionChanged={this.onSelectionChanged}
          dataSource={this.orders}
          keyExpr="ID"
          showBorders={true}>
          <Paging enabled={false} />
          <Selection mode="multiple" />
          <Column dataField="OrderNumber" width={130} caption="Invoice Number" />
          <Column dataField="OrderDate" width={160} dataType="date" />
          <Column dataField="Employee" />
          <Column dataField="CustomerStoreCity" caption="City" />
          <Column dataField="CustomerStoreState" caption="State" />
          <Column dataField="SaleAmount" alignment="right" format="currency" />
          <Summary calculateCustomSummary={this.calculateSelectedRow}>
            <TotalItem
              name="SelectedRowsSummary"
              summaryType="custom"
              valueFormat="currency"
              displayFormat="Sum: {0}"
              showInColumn="SaleAmount" />
          </Summary>
        </DataGrid>
      </React.Fragment>
    );
  }
}

export default App;
