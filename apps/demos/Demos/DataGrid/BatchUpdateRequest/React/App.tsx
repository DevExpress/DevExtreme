import React from 'react';
import DataGrid, { DataGridRef, Column, DataGridTypes, Editing } from 'devextreme-react/data-grid';
import { createStore } from 'devextreme-aspnet-data-nojquery';
import 'whatwg-fetch';

const URL = 'https://js.devexpress.com/Demos/Mvc/api/DataGridBatchUpdateWebApi';

const ordersStore = createStore({
  key: 'OrderID',
  loadUrl: `${URL}/Orders`,
  onBeforeSend: (method, ajaxOptions) => {
    ajaxOptions.xhrFields = { withCredentials: true };
  },
});

async function sendBatchRequest(url: string, changes: DataGridTypes.DataChange[]) {
  const result = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(changes),
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    credentials: 'include',
  });

  if (!result.ok) {
    const json = await result.json();

    throw json.Message;
  }
}

async function processBatchRequest(url: string, changes: DataGridTypes.DataChange[], component: DataGridRef) {
  await sendBatchRequest(url, changes);
  await component.instance().refresh(true);
  component.instance().cancelEditData();
}

const onSaving = (e: DataGridTypes.SavingEvent) => {
  e.cancel = true;

  if (e.changes.length) {
    e.promise = processBatchRequest(`${URL}/Batch`, e.changes, e.component);
  }
};

const App = () => (
  <DataGrid
    id="gridContainer"
    dataSource={ordersStore}
    showBorders={true}
    remoteOperations={true}
    repaintChangesOnly={true}
    onSaving={onSaving}>
    <Editing
      mode="batch"
      allowAdding={true}
      allowDeleting={true}
      allowUpdating={true}
    />
    <Column dataField="OrderID" allowEditing={false}></Column>
    <Column dataField="ShipName"></Column>
    <Column dataField="ShipCountry"></Column>
    <Column dataField="ShipCity"></Column>
    <Column dataField="ShipAddress"></Column>
    <Column dataField="OrderDate" dataType="date"></Column>
    <Column dataField="Freight"></Column>
  </DataGrid>
);

export default App;
