<template>
  <DxDataGrid
    :columns="columns"
    :show-borders="true"
    data-source="../../../../data/customers.json"
  />
</template>
<script>

import DxDataGrid from 'devextreme-vue/data-grid';

export default {
  components: {
    DxDataGrid
  },
  data() {
    return {
      columns: ['CompanyName', 'City', 'State', 'Phone', 'Fax']
    };
  }
};
</script>
