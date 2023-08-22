import React from 'react';
import DataGrid, {
  Column, Selection, Paging, Summary, TotalItem,
} from 'devextreme-react/data-grid';
import { orders } from './data.js';

const startupSelectedKeys = [1, 4, 7];

const calculateSelectedRow = (options) => {
  if (options.name === 'SelectedRowsSummary') {
    if (options.summaryProcess === 'start') {
      options.totalValue = 0;
    }

    const isRowSelected = options.component.isRowSelected(options.value?.ID);

    if (options.summaryProcess === 'calculate' && isRowSelected) {
      options.totalValue += options.value.SaleAmount;
    }
  }
};

const onSelectionChanged = (e) => e.component.refresh(true);

const App = () => (
  <DataGrid
    id="gridContainer"
    defaultSelectedRowKeys={startupSelectedKeys}
    onSelectionChanged={onSelectionChanged}
    dataSource={orders}
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
    <Summary calculateCustomSummary={calculateSelectedRow}>
      <TotalItem
        name="SelectedRowsSummary"
        summaryType="custom"
        valueFormat="currency"
        displayFormat="Sum: {0}"
        showInColumn="SaleAmount" />
    </Summary>
  </DataGrid>
);

export default App;
