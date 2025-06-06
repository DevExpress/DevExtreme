<template>
  <DxCardView
    id="cardView"
    :data-source="orders"
    key-expr="ID"
    :cards-per-row="2"
    :allow-column-reordering="true"
  >
    <DxPaging
      :page-size="4"
    />
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
import { DxCardView, DxColumn, DxPaging } from 'devextreme-vue/card-view';
import { orders } from './data.ts';
</script>
