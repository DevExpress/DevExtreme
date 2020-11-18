import React from 'react';
import DataGrid, { Column, Selection, Summary, GroupItem, SortByGroupSummaryInfo } from 'devextreme-react/data-grid';
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
          showBorders={true}>
          <Selection mode="single" />
          <Column dataField="OrderNumber" width={130} caption="Invoice Number" />
          <Column dataField="OrderDate" width={160} dataType="date" />
          <Column dataField="Employee" groupIndex={0} />
          <Column dataField="CustomerStoreCity" caption="City" />
          <Column dataField="CustomerStoreState" caption="State" />
          <Column dataField="SaleAmount" alignment="right" format="currency" />
          <Column dataField="TotalAmount" alignment="right" format="currency" />

          <Summary>
            <GroupItem
              column="OrderNumber"
              summaryType="count"
              displayFormat="{0} orders" />
            <GroupItem
              column="SaleAmount"
              summaryType="max"
              valueFormat="currency"
              showInGroupFooter={false}
              alignByColumn={true} />
            <GroupItem
              column="TotalAmount"
              summaryType="max"
              valueFormat="currency"
              showInGroupFooter={false}
              alignByColumn={true} />
            <GroupItem
              column="TotalAmount"
              summaryType="sum"
              valueFormat="currency"
              displayFormat="Total: {0}"
              showInGroupFooter={true} />
          </Summary>
          <SortByGroupSummaryInfo summaryItem="count" />
        </DataGrid>
      </React.Fragment>
    );
  }
}

export default App;
