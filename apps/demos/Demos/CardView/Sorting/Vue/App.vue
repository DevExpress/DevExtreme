<template>
  <DxCardView
    :data-source=houses
    key-expr="ID"
  >
    <DxCardCover
      :image-expr=imageExpr
      :alt-expr=altExpr
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
  import { DxCardView, DxColumn, DxCardCover } from 'devextreme-vue/card-view';
  import { houses, type House } from './data.ts';

  function imageExpr({ ID }: House): string {
    return `https://demos.devexpress.com/ASPxCardViewDemos/Content/HomesPhoto/${ID}.jpg`;
  }

  function altExpr(): string {
    return 'Photo of the house';
  }
</script>
