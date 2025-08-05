<template>
  <DxCardView
    :data-source="customers"
    key-expr="ID"
    cards-per-row="auto"
    :card-min-width="320"
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

const columns = ['Company', 'Address', 'City', 'State', 'Zipcode', 'Phone'];
</script>
