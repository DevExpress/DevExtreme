<template>
  <DxDataGrid
    :data-source="dataSource"
    :show-borders="true"
  >
    <DxPaging :page-size="10"/>
    <DxPager
      :show-page-size-selector="true"
      :allowed-page-sizes="pageSizes"
      :show-info="true"
    />

    <DxColumn data-field="CompanyName"/>
    <DxColumn data-field="City"/>
    <DxColumn data-field="State"/>
    <DxColumn data-field="Phone"/>
    <DxColumn data-field="Fax"/>
  </DxDataGrid>
</template>
<script>

import { DxDataGrid, DxColumn, DxPager, DxPaging } from 'devextreme-vue/data-grid';
import { customers } from './data.js';

export default {
  components: {
    DxDataGrid,
    DxColumn,
    DxPager,
    DxPaging
  },
  data() {
    return {
      dataSource: customers,
      pageSizes: [5, 10, 20]
    };
  }
};
</script>
