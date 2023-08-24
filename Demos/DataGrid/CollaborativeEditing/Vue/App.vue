<template>
  <div class="tables">
    <Grid
      :data-source="store1"
      class="column"
    />
    <Grid
      :data-source="store2"
      class="column"
    />
  </div>
</template>
<script setup lang="ts">
import { HubConnectionBuilder, HttpTransportType } from '@aspnet/signalr';
import * as AspNetData from 'devextreme-aspnet-data-nojquery';
import Guid from 'devextreme/core/guid';
import Grid from './Grid.vue';

const BASE_PATH = 'https://js.devexpress.com/Demos/NetCore/';
const url = `${BASE_PATH}api/DataGridCollaborativeEditing/`;
const groupId = new Guid().toString();

const createStore = () => AspNetData.createStore({
  key: 'ID',
  loadUrl: url,
  insertUrl: url,
  updateUrl: url,
  deleteUrl: url,
  onBeforeSend(operation, ajaxSettings) {
    ajaxSettings.data.groupId = groupId;
  },
});

const store1 = createStore();
const store2 = createStore();

const updateStores = (events: any[]) => {
  store1.push(events);
  store2.push(events);
};

const hubUrl = `${BASE_PATH}dataGridCollaborativeEditingHub?GroupId=${groupId}`;
const connection = new HubConnectionBuilder()
  .withUrl(hubUrl, {
    skipNegotiation: true,
    transport: HttpTransportType.WebSockets,
  })
  .build();

connection.start()
  .then(() => {
    connection.on('update', (key, data) => {
      updateStores([{ type: 'update', key, data }]);
    });

    connection.on('insert', (data) => {
      updateStores([{ type: 'insert', data }]);
    });

    connection.on('remove', (key) => {
      updateStores([{ type: 'remove', key }]);
    });
  });
</script>

<style scoped>
.tables {
  display: flex;
}

.column:first-child {
  width: 50%;
  padding-right: 15px;
}

.column:last-child {
  width: 50%;
  padding-left: 15px;
}
</style>
