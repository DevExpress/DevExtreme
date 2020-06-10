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
<script>
import { HubConnectionBuilder, HttpTransportType } from '@aspnet/signalr';
import * as AspNetData from 'devextreme-aspnet-data-nojquery';
import Grid from './Grid.vue';
import Guid from 'devextreme/core/guid';

const BASE_PATH = 'https://js.devexpress.com/Demos/NetCore/';
const url = `${BASE_PATH }api/DataGridCollaborativeEditing/`;
const groupId = new Guid().toJSON();

const createStore = () => AspNetData.createStore({
  key: 'ID',
  loadUrl: url,
  insertUrl:url,
  updateUrl:url,
  deleteUrl:url,
  onBeforeSend: function(operation, ajaxSettings) {
    ajaxSettings.data.groupId = groupId;
  }
});

const store1 = createStore();
const store2 = createStore();

const updateStores = (events) => {
  store1.push(events);
  store2.push(events);
};

export default {
  components: {
    Grid
  },
  data() {
    return {
      store1,
      store2
    };
  }
};

const hubUrl = `${BASE_PATH}dataGridCollaborativeEditingHub?GroupId=${groupId}`;
const connection = new HubConnectionBuilder()
  .withUrl(hubUrl, {
    skipNegotiation: true,
    transport: HttpTransportType.WebSockets
  })
  .build();

connection.start()
  .then(function() {
    connection.on('update', function(key, data) {
      updateStores([{ type: 'update', key: key, data: data }]);
    });

    connection.on('insert', function(data) {
      updateStores([{ type: 'insert', data: data }]);
    });

    connection.on('remove', function(key) {
      updateStores([{ type: 'remove', key: key }]);
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
