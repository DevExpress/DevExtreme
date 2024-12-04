<template>
  <DxDataGrid
    :data-source="dataSource"
    :columns="columns"
    :show-borders="true"
  />
  <DxPagination
    :show-info="showInfo"
    :show-navigation-buttons="showPageSizeSelector"
    :allowed-page-sizes="pageSizes"
    :page-index="pageIndex"
    :page-size="pageSize"
    :item-count="itemCount"
  />
</template>
<script>

import { computed, ref } from 'vue';
import DxDataGrid from 'devextreme-vue/data-grid';
import DxPagination from 'devextreme-vue/pagination';
import { customers } from './data.js';

const pageSizes = [4, 6];

const showInfo = true;
const showPageSizeSelector = true;
const pageIndex = 1;
const pageSize = 4;
const itemCount = customers.length;

export default {
  components: {
    DxDataGrid,
    DxPagination,
  },
  data() {
    return {
      dataSource: customers,
      columns: ['CompanyName', 'City', 'State', 'Phone', 'Fax'],
    };
  },
};
</script>
