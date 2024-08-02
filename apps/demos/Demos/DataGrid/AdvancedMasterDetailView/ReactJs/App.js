import React from 'react';
import {
  Column, DataGrid, MasterDetail, Paging, Pager,
} from 'devextreme-react/data-grid';
import { createStore } from 'devextreme-aspnet-data-nojquery';
import MasterDetailView from './MasterDetailView.js';

const url = 'https://js.devexpress.com/Demos/Mvc/api/DataGridAdvancedMasterDetailView';
const suppliersData = createStore({
  key: 'SupplierID',
  loadUrl: `${url}/GetSuppliers`,
});
const App = () => (
  <DataGrid
    dataSource={suppliersData}
    remoteOperations={true}
    showBorders={true}
    id="gridContainer"
  >
    <MasterDetail
      enabled={true}
      component={MasterDetailView}
    />
    <Paging defaultPageSize={15} />
    <Pager visible={true} />

    <Column dataField="ContactName" />
    <Column dataField="ContactTitle" />
    <Column dataField="CompanyName" />
    <Column dataField="City" />
    <Column dataField="Country" />
  </DataGrid>
);
export default App;
