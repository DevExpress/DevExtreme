<template>
  <DxCardView
    :data-source="customers"
    key-expr="ID"
  >
    <DxColumn
      v-for="column in columns"        
      :data-field="column"
    />
  </DxCardView>
</template>
<script setup lang="ts">
  import { DxCardView, DxColumn } from 'devextreme-vue/card-view';
  import { customers } from './data.ts';

  const columns = ['CompanyName', 'City', 'State', 'Phone', 'Fax'];
</script>
