import React from 'react';
import DataGrid, { Column, Editing, Pager } from 'devextreme-react/data-grid';
import type { DataGridRef, DataGridTypes } from 'devextreme-react/data-grid';
import { createStore } from 'devextreme-aspnet-data-nojquery';
import 'whatwg-fetch';

const BASE_PATH = 'https://js.devexpress.com/Demos/NetCore';
const URL = `${BASE_PATH}/api/DataGridBatchUpdateWebApi`;

async function fetchAntiForgeryToken(): Promise<{ headerName: string; token: string }> {
  try {
    const response = await fetch(`${BASE_PATH}/api/Common/GetAntiForgeryToken`, {
      method: 'GET',
      credentials: 'include',
      cache: 'no-cache',
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Failed to retrieve anti-forgery token: ${errorMessage || response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(errorMessage);
  }
}

async function getAntiForgeryTokenValue(): Promise<{ headerName: string; token: string }> {
  const tokenMeta = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]');
  if (tokenMeta) {
    const headerName = tokenMeta.dataset.headerName || 'RequestVerificationToken';
    const token = tokenMeta.getAttribute('content') || '';
    return Promise.resolve({ headerName, token });
  }

  const tokenData = await fetchAntiForgeryToken();
  const meta = document.createElement('meta');
  meta.name = 'csrf-token';
  meta.content = tokenData.token;
  meta.dataset.headerName = tokenData.headerName;
  document.head.appendChild(meta);
  return tokenData;
}

const ordersStore = createStore({
  key: 'OrderID',
  loadUrl: `${URL}/Orders`,
  async onBeforeSend(_method, ajaxOptions) {
    const tokenData = await getAntiForgeryTokenValue();
    ajaxOptions.xhrFields = {
      withCredentials: true,
      headers: { [tokenData.headerName]: tokenData.token },
    };
  },
});

function normalizeChanges(changes: DataGridTypes.DataChange[]): DataGridTypes.DataChange[] {
  return changes.map((c) => {
    switch (c.type) {
      case 'insert':
        return {
          type: c.type,
          data: c.data,
        };
      case 'update':
        return {
          type: c.type,
          key: c.key,
          data: c.data,
        };
      case 'remove':
        return {
          type: c.type,
          key: c.key,
        };
      default:
        return c;
    }
  }) as DataGridTypes.DataChange[];
}

async function sendBatchRequest(url: string, changes: DataGridTypes.DataChange[], headers: Record<string, string>) {
  try {
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(changes),
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        ...headers,
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Batch save failed: ${errorMessage || response.statusText}`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(errorMessage);
  }
}

async function processBatchRequest(url: string, changes: DataGridTypes.DataChange[], component: ReturnType<DataGridRef['instance']>) {
  const tokenData = await getAntiForgeryTokenValue();
  await sendBatchRequest(url, changes, { [tokenData.headerName]: tokenData.token });
  await component.refresh(true);
  component.cancelEditData();
}

const onSaving = (e: DataGridTypes.SavingEvent) => {
  e.cancel = true;

  if (e.changes.length) {
    const changes = normalizeChanges(e.changes);
    e.promise = processBatchRequest(`${URL}/Batch`, changes, e.component);
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
    <Pager visible={true} />
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
