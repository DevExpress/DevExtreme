<template>
  <DxDataGrid
    id="grid-container"
    :show-borders="true"
    :data-source="employees"
    key-expr="ID"
  >
    <DxColumn
      :width="70"
      data-field="Prefix"
      caption="Title"
    />
    <DxColumn data-field="FirstName"/>
    <DxColumn data-field="LastName"/>
    <DxColumn
      :width="170"
      data-field="Position"
    />
    <DxColumn
      :width="125"
      data-field="State"
    />
    <DxColumn
      data-field="BirthDate"
      data-type="date"
    />
    <DxMasterDetail
      :enabled="true"
      template="masterDetailTemplate"
    />
    <template #masterDetailTemplate="{ data: employee }">
      <DetailTemplate
        :template-data="employee"
      />
    </template>
  </DxDataGrid>
</template>
<script setup lang="ts">
import {
  DxDataGrid,
  DxColumn,
  DxMasterDetail,
} from 'devextreme-vue/data-grid';
import DetailTemplate from './DetailTemplate.vue';
import { employees } from './data.js';

</script>
<style>
#grid-container {
  height: 440px;
}
</style>
