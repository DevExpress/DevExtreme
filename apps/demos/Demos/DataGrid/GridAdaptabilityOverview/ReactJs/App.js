import React from 'react';
import DataGrid, {
  Column,
  Editing,
  Grouping,
  GroupPanel,
  Pager,
  Paging,
  ColumnChooser,
} from 'devextreme-react/data-grid';
import { orders } from './data.js';

const allowedPageSizes = [5, 8, 15, 30];
const App = () => (
  <div>
    <DataGrid
      id="gridContainer"
      dataSource={orders}
      keyExpr="ID"
      columnHidingEnabled={true}
      width="100%"
      showBorders={true}
    >
      <Editing
        allowAdding={true}
        allowUpdating={true}
        mode="batch"
      />
      <Grouping
        contextMenuEnabled={true}
        expandMode="rowClick"
      />
      <GroupPanel
        visible={true}
        emptyPanelText="Use the context menu of header columns to group data"
      />
      <Pager
        allowedPageSizes={allowedPageSizes}
        showInfo={true}
        showNavigationButtons={true}
        showPageSizeSelector={true}
        visible={true}
      />
      <Paging defaultPageSize={8} />
      <ColumnChooser
        enabled={true}
        mode="select"
      />
      <Column
        allowGrouping={false}
        dataField="OrderNumber"
        width={130}
        caption="Invoice Number"
      />
      <Column
        dataField="CustomerStoreCity"
        caption="City"
      />
      <Column
        dataField="CustomerStoreState"
        caption="State"
      />
      <Column dataField="Employee" />
      <Column
        dataField="OrderDate"
        dataType="date"
      />
      <Column
        dataField="SaleAmount"
        format="currency"
      />
    </DataGrid>
  </div>
);
export default App;
