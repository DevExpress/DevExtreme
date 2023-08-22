<template>
  <div class="tables">
    <Grid
      :tasks-store="tasksStore"
      :status="1"
      class="column"
    />
    <Grid
      :tasks-store="tasksStore"
      :status="2"
      class="column"
    />
  </div>
</template>
<script setup lang="ts">
import * as AspNetData from 'devextreme-aspnet-data-nojquery';
import Grid from './Grid.vue';

const url = 'https://js.devexpress.com/Demos/Mvc/api/DnDBetweenGrids';

const tasksStore = AspNetData.createStore({
  key: 'ID',
  loadUrl: `${url}/Tasks`,
  updateUrl: `${url}/UpdateTask`,
  onBeforeSend(method, ajaxOptions) {
    ajaxOptions.xhrFields = { withCredentials: true };
  },
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
