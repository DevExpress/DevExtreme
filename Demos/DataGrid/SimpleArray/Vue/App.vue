<template>
  <DxDataGrid
    :data-source="dataSource"
    :columns="columns"
    :show-borders="true"
  />
</template>
<script>

import DxDataGrid from 'devextreme-vue/data-grid';
import { customers } from './data.js';

export default {
  components: {
    DxDataGrid
  },
  data() {
    return {
      dataSource: customers,
      columns: ['CompanyName', 'City', 'State', 'Phone', 'Fax']
    };
  }
};
</script>
