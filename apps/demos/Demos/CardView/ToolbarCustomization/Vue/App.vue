<template>
  <DxCardView
    :data-source="customers"
    key-expr="ID"
    :card-min-width="100"
    :word-wrap-enabled="true"
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
