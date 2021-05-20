<template>
  <div>
    <DxDataGrid
      id="gridContainer"
      :data-source="employees"
      key-expr="ID"
      :show-borders="true"
    >
      <DxColumn
        :width="100"
        :allow-sorting="false"
        data-field="Picture"
        cell-template="cellTemplate"
      />
      <DxColumn
        :width="70"
        data-field="Prefix"
        caption="Title"
      />
      <DxColumn data-field="FirstName"/>
      <DxColumn data-field="LastName"/>
      <DxColumn data-field="Position"/>
      <DxColumn
        data-field="BirthDate"
        data-type="date"
      />
      <DxColumn
        data-field="HireDate"
        data-type="date"
      />
      <template #cellTemplate="{ data }">
        <img :src="data.value">
      </template>
    </DxDataGrid>
  </div>
</template>
<script>
import { DxDataGrid, DxColumn } from 'devextreme-vue/data-grid';

import service from './data.js';

export default {
  components: {
    DxDataGrid,
    DxColumn
  },
  data() {
    return {
      employees: service.getEmployees()
    };
  }
};
</script>
<style scoped>
#gridContainer {
  height: 440px;
}

img {
  height: 100px;
  display: block;
}
</style>
