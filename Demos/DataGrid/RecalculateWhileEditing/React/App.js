import React from 'react';
import DataGrid, {
  Column, Editing, Summary, TotalItem,
} from 'devextreme-react/data-grid';
import { orders } from './data.js';

const saleAmountEditorOptions = { format: 'currency' };

const App = () => (
  <DataGrid
    id="gridContainer"
    dataSource={orders}
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
    <Column dataField="SaleAmount" width={160} alignment="right" format="currency" editorOptions={saleAmountEditorOptions} />
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
);

export default App;
