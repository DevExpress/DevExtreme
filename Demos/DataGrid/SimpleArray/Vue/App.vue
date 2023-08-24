<template>
  <DxDataGrid
    :data-source="customers"
    key-expr="ID"
    :columns="columns"
    :show-borders="true"
  />
</template>
<script setup lang="ts">
import DxDataGrid from 'devextreme-vue/data-grid';
import { customers } from './data.ts';

const columns = ['CompanyName', 'City', 'State', 'Phone', 'Fax'];
</script>
