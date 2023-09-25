import React from 'react';
import DataGrid, {
  Column, Selection, Summary, GroupItem, SortByGroupSummaryInfo,
} from 'devextreme-react/data-grid';
import { orders } from './data.js';

const App = () => (
  <DataGrid
    id="gridContainer"
    dataSource={orders}
    keyExpr="ID"
    showBorders={true}
  >
    <Selection mode="single" />
    <Column dataField="OrderNumber" width={130} caption="Invoice Number" />
    <Column dataField="OrderDate" dataType="date" />
    <Column dataField="Employee" groupIndex={0} />
    <Column dataField="CustomerStoreCity" caption="City" />
    <Column dataField="CustomerStoreState" caption="State" />
    <Column dataField="SaleAmount" width={160} alignment="right" format="currency" />
    <Column dataField="TotalAmount" width={160} alignment="right" format="currency" />

    <Summary>
      <GroupItem
        column="OrderNumber"
        summaryType="count"
        displayFormat="{0} orders"
      />
      <GroupItem
        column="SaleAmount"
        summaryType="max"
        valueFormat="currency"
        showInGroupFooter={false}
        alignByColumn={true}
      />
      <GroupItem
        column="TotalAmount"
        summaryType="max"
        valueFormat="currency"
        showInGroupFooter={false}
        alignByColumn={true}
      />
      <GroupItem
        column="TotalAmount"
        summaryType="sum"
        valueFormat="currency"
        displayFormat="Total: {0}"
        showInGroupFooter={true}
      />
    </Summary>
    <SortByGroupSummaryInfo summaryItem="count" />
  </DataGrid>
);

export default App;
