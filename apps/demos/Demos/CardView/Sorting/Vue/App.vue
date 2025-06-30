<template>
  <DxCardView
    :data-source="houses"
    key-expr="ID"
    cards-per-row="auto"
    :card-min-width="350"
    :word-wrap-enabled="true"
  >
    <DxSorting
      mode="multiple"
    />
    <DxCardCover
      :image-expr="imageExpr"
      :alt-expr="altExpr"
    />
    <DxColumn
      data-field="Address"
    />
    <DxColumn
      data-field="Price"
      format="currency"
      sort-order="asc"
    />
    <DxColumn
      data-field="HouseSize"
    />
    <DxColumn
      data-field="Baths"
    />
    <DxColumn
      data-field="Beds"
      sort-order="desc"
    />
  </DxCardView>
</template>
<script setup lang="ts">
import { DxCardView, DxColumn, DxCardCover, DxSorting } from 'devextreme-vue/card-view';
import { houses, type House } from './data.ts';

function imageExpr({ ID }: House): string {
  return `../../../../images/houses/${ID}.jpg`;
}

function altExpr(): string {
  return 'Photo of the house';
}
</script>
