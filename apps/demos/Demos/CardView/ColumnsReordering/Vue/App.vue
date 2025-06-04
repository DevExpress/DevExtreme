<template>
  <DxCardView
    id="cardView"
    :data-source="orders"
    key-expr="ID"
    :card-min-width="100"
    :word-wrap-enabled="true"
    :allow-column-reordering="true"
  >
    <DxColumn
      data-field="OrderNumber"
      :allow-reordering="false"
    />
    <DxColumn data-field="SaleAmount"/>
    <DxColumn data-field="Customer"/>
    <DxColumn data-field="Location"/>
    <DxColumn
      data-field="OrderDate"
      data-type="date"
    />
    <DxColumn
      data-field="DeliveryDate"
      data-type="date"
    />
  </DxCardView>
</template>
<script setup lang="ts">
import { DxCardView, DxColumn } from 'devextreme-vue/card-view';
import { orders } from './data.ts';
</script>
