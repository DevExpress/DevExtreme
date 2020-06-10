<template>
  <DxDataGrid
    :data-source="dataSource"
    :show-borders="true"
  />
</template>

<script>
import DxDataGrid from 'devextreme-vue/data-grid';
import { createStore } from 'devextreme-aspnet-data-nojquery';

const getMasterDetailGridDataSource = (id, url) => {
  return {
    store: createStore({
      loadUrl: `${url}/OrderDetails`,
      loadParams: { orderID: id },
      onBeforeSend: (method, ajaxOptions) => {
        ajaxOptions.xhrFields = { withCredentials: true };
      }
    })
  };
};

export default {
  components: { DxDataGrid },
  props: {
    id: {
      type: Number,
      default: () => 0
    },
    url: {
      type: String,
      default: () => ''
    }
  },
  data() {
    return {
      dataSource: getMasterDetailGridDataSource(this.id, this.url)
    };
  }
};
</script>
