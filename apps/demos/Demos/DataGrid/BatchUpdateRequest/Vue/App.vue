<template>
  <DxDataGrid
    id="gridContainer"
    :data-source="ordersStore"
    :show-borders="true"
    :remote-operations="true"
    :repaint-changes-only="true"
    @saving="onSaving"
  >
    <DxEditing
      mode="batch"
      :allow-adding="true"
      :allow-deleting="true"
      :allow-updating="true"
    />
    <DxPager :visible="true"/>
    <DxColumn
      data-field="OrderID"
      :allow-editing="false"
    />
    <DxColumn data-field="ShipName"/>
    <DxColumn data-field="ShipCountry"/>
    <DxColumn data-field="ShipCity"/>
    <DxColumn data-field="ShipAddress"/>
    <DxColumn
      data-field="OrderDate"
      data-type="date"
    />
    <DxColumn data-field="Freight"/>
  </DxDataGrid>
</template>
<script setup lang="ts">
import {
  DxDataGrid, DxColumn, DxEditing, type DxDataGridTypes, DxPager,
} from 'devextreme-vue/data-grid';
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

const onSaving = (e: DxDataGridTypes.SavingEvent) => {
  e.cancel = true;

  if (e.changes.length) {
    const changes = normalizeChanges(e.changes);
    e.promise = processBatchRequest(`${URL}/Batch`, changes, e.component);
  }
};

function normalizeChanges(changes: DxDataGridTypes.DataChange[]): DxDataGridTypes.DataChange[] {
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
  }) as DxDataGridTypes.DataChange[];
}

async function processBatchRequest(
  url: string, changes: DxDataGridTypes.DataChange[], component: DxDataGrid['instance'],
) {
  const tokenData = await getAntiForgeryTokenValue();
  await sendBatchRequest(url, changes, { [tokenData.headerName]: tokenData.token });
  await component?.refresh(true);

  component?.cancelEditData();
}

async function sendBatchRequest(
  url: string,
  changes: DxDataGridTypes.DataChange[],
  headers: Record<string, string>,
) {
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
</script>
<style scoped>
#gridContainer {
  height: 440px;
}
</style>
