<template>
  <DxDataGrid
    id="gridContainer"
    :data-source="suppliersData"
    :remote-operations="true"
    :show-borders="true"
  >
    <DxPaging :page-size="15"/>

    <DxColumn data-field="ContactName"/>
    <DxColumn data-field="ContactTitle"/>
    <DxColumn data-field="CompanyName"/>
    <DxColumn data-field="City"/>
    <DxColumn data-field="Country"/>
    <DxMasterDetail
      :enabled="true"
      template="master-detail"
    />
    <template #master-detail="{ data }">
      <MasterDetail :master-detail-data="data"/>
    </template>
  </DxDataGrid>
</template>

<script>
import {
  DxDataGrid,
  DxColumn,
  DxPaging,
  DxMasterDetail,
} from 'devextreme-vue/data-grid';

import MasterDetail from './MasterDetail.vue';
import { createStore } from 'devextreme-aspnet-data-nojquery';

const url = 'https://js.devexpress.com/Demos/Mvc/api/DataGridAdvancedMasterDetailView';

export default {
  components: {
    DxDataGrid,
    DxColumn,
    DxPaging,
    DxMasterDetail,
    MasterDetail
  },
  data() {
    return {
      suppliersData: createStore({
        key: 'SupplierID',
        loadUrl: `${url}/GetSuppliers`
      })
    };
  }
};
</script>
