import React from 'react';
import DataGrid, { Column, Editing } from 'devextreme-react/data-grid';
import { createStore } from 'devextreme-aspnet-data-nojquery';
import 'whatwg-fetch';

var URL = 'https://js.devexpress.com/Demos/Mvc/api/DataGridBatchUpdateWebApi';

const ordersStore = createStore({
  key: 'OrderID',
  loadUrl: `${URL}/Orders`,
  onBeforeSend: (method, ajaxOptions) => {
    ajaxOptions.xhrFields = { withCredentials: true };
  }
});

async function sendBatchRequest(url, changes) {
  const result = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(changes),
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    credentials: 'include'
  });

  if (!result.ok) {
    const json = await result.json();

    throw json.Message;
  }
}

async function processBatchRequest(url, changes, component) {
  await sendBatchRequest(url, changes);
  await component.refresh(true);
  component.cancelEditData();
}

function App() {
  const onSaving = React.useCallback((e) => {
    e.cancel = true;

    if (e.changes.length) {
      e.promise = processBatchRequest(`${URL}/Batch`, e.changes, e.component);
    }
  }, []);

  return (
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
}

export default App;
