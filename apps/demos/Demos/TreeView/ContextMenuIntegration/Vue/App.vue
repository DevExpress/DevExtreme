<template>
  <div class="form">
    <DxTreeView
      id="treeview"
      ref="treeViewRef"
      :items="products"
      :width="300"
      :height="450"
      @item-context-menu="treeViewItemContextMenu"
    />
    <div class="log-container">
      <div><i class="icon dx-icon-clock"/>&nbsp;Operations log:</div>
      <DxList
        id="log"
        show-scrollbar="always"
        :width="400"
        :height="300"
        :items="logItems"
      />
    </div>
    <DxContextMenu
      ref="contextMenuRef"
      v-model:data-source="menuItems"
      target="#treeview .dx-treeview-item"
      @item-click="contextMenuItemClick"
    />
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import DxTreeView from 'devextreme-vue/tree-view';
import DxList from 'devextreme-vue/list';
import DxContextMenu from 'devextreme-vue/context-menu';
import service from './data.ts';

const products = ref(service.getProducts());
const menuItems = ref(service.getMenuItems());
const logItems = ref([]);
const selectedTreeItem = ref(undefined);
const treeViewRef = ref();
const contextMenuRef = ref();

function treeViewItemContextMenu(e) {
  selectedTreeItem.value = e.itemData;
  const contextMenu = contextMenuRef.value.instance;
  const isProduct = e.itemData.price !== undefined;

  contextMenu.option('items[0].visible', !isProduct);
  contextMenu.option('items[1].visible', !isProduct);
  contextMenu.option('items[2].visible', isProduct);
  contextMenu.option('items[3].visible', isProduct);

  contextMenu.option('items[0].disabled', e.node.expanded);
  contextMenu.option('items[1].disabled', !e.node.expanded);
}
function contextMenuItemClick(e) {
  const treeView = treeViewRef.value.instance;
  let logEntry = '';

  switch (e.itemData.id) {
    case 'expand': {
      logEntry = `The '${selectedTreeItem.value.text}' group was expanded`;
      treeView.expandItem(selectedTreeItem.value.id);
      break;
    }
    case 'collapse': {
      logEntry = `The '${selectedTreeItem.value.text}' group was collapsed`;
      treeView.collapseItem(selectedTreeItem.value.id);
      break;
    }
    case 'details': {
      logEntry = `Details about '${selectedTreeItem.value.text}' were displayed`;
      break;
    }
    case 'copy': {
      logEntry = `Information about '${selectedTreeItem.value.text}' was copied`;
      break;
    }
    default:
      break;
  }
  logItems.value = logItems.value.concat(logEntry);
}
</script>
<style scoped>
.form {
  display: flex;
}

.form > div,
#treeview {
  display: inline-block;
  vertical-align: top;
}

.log-container {
  padding: 20px;
  margin-left: 20px;
  background-color: rgba(191, 191, 191, 0.15);
  font-size: 115%;
  font-weight: bold;
  position: relative;
  height: 100%;
}

.log-container .dx-icon-clock {
  position: relative;
  top: 1px;
}

#log {
  margin-top: 10px;
}

#log .dx-empty-message {
  padding-left: 0;
}

.dx-list-item-content {
  padding-left: 0;
}
</style>
