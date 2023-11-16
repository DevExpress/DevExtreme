<template>
  <div>
    <div class="label">
      Right click the image to show available actions:
    </div>
    <img
      id="image"
      alt="product"
      :src="'../../../../images/products/7.png'"
    >
    <DxContextMenu
      :data-source="items"
      :width="200"
      target="#image"
      @item-click="itemClick"
    />
  </div>
</template>
<script setup lang="ts">
import DxContextMenu, { DxContextMenuTypes } from 'devextreme-vue/context-menu';
import notify from 'devextreme/ui/notify';
import { contextMenuItems as items } from './data.js';

function itemClick({ itemData }: DxContextMenuTypes.ItemClickEvent) {
  if (!itemData.items) {
    notify(`The "${itemData.text}" item was clicked`, 'success', 1500);
  }
}
</script>
<style>
#image {
  height: 300px;
}

.label {
  color: #767676;
}
</style>
