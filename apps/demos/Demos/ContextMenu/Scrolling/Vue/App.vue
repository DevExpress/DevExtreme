<template>
  <div class="demo-container">
    <div class="target-area">
      Right click here to show the context menu
    </div>
    <DxContextMenu
      :data-source="items"
      :width="200"
      target=".target-area"
      @item-click="itemClick"
    />
  </div>
</template>
<script setup lang="ts">
import DxContextMenu, { DxContextMenuTypes } from 'devextreme-vue/context-menu';
import notify from 'devextreme/ui/notify';
import { contextMenuItems as items } from './data.ts';

function itemClick({ itemData }: DxContextMenuTypes.ItemClickEvent) {
  if (!itemData.items) {
    notify(`The "${itemData.text}" item was clicked`, 'success', 1500);
  }
}
</script>
<style>
.demo-container {
  position: absolute;
  top: 8px;
  left: 8px;
  right: 8px;
  bottom: 8px;
  height: 100%;
}

.target-area {
  color: var(--dx-color-text);
  background-color: var(--dx-color-border);
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  user-select: none;
}
</style>
