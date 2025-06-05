<template>
  <DxCardView
    :data-source="customers"
    key-expr="ID"
    :cards-per-row="2"
  >
    <DxPaging
      :page-size="4"
    />
    <DxColumn
      v-for="column in columns"
      :data-field="column"
    />
  </DxCardView>
</template>
<script setup lang="ts">
import { DxCardView, DxColumn, DxPaging } from 'devextreme-vue/card-view';
import { customers } from './data.ts';

const columns = ['CompanyName', 'Address', 'City', 'State', 'Zipcode', 'Phone'];
</script>
