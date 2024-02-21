import React from 'react';
import DataGrid, {
  Column, Selection, Summary, TotalItem,
} from 'devextreme-react/data-grid';
import { formatDate } from 'devextreme/localization';
import { orders } from './data.ts';

const customizeDate = (itemInfo) => `First: ${formatDate(itemInfo.value, 'MMM dd, yyyy')}`;

const App = () => (
  <DataGrid
    id="gridContainer"
    dataSource={orders}
    keyExpr="ID"
    showBorders={true}>
    <Selection mode="single" />
    <Column dataField="OrderNumber" width={130} caption="Invoice Number" />
    <Column dataField="OrderDate" dataType="date" />
    <Column dataField="Employee" />
    <Column dataField="CustomerStoreCity" caption="City" />
    <Column dataField="CustomerStoreState" caption="State" />
    <Column dataField="SaleAmount" width={160} alignment="right" format="currency" />
    <Summary>
      <TotalItem
        column="OrderNumber"
        summaryType="count" />
      <TotalItem
        column="OrderDate"
        summaryType="min"
        customizeText={customizeDate} />
      <TotalItem
        column="SaleAmount"
        summaryType="sum"
        valueFormat="currency" />
    </Summary>
  </DataGrid>
);

export default App;
