<template>
  <DxDataGrid
    :data-source="dataSource"
    :show-borders="true"
  />
</template>

<script setup lang="ts">
import DxDataGrid from 'devextreme-vue/data-grid';
import { createStore } from 'devextreme-aspnet-data-nojquery';

const props = defineProps<{
  id: number
  url: string
}>();

const getMasterDetailGridDataSource = (id: number, url: string) => ({
  store: createStore({
    loadUrl: `${url}/OrderDetails`,
    loadParams: { orderID: id },
    onBeforeSend: (method, ajaxOptions) => {
      ajaxOptions.xhrFields = { withCredentials: true };
    },
  }),
});

const dataSource = getMasterDetailGridDataSource(props.id, props.url);
</script>
