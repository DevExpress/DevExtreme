<template>
  <div class="form">
    <div class="drive-panel">
      <div
        class="drive-header dx-treeview-item"
      ><div
        class="dx-treeview-item-content"
      ><i class="dx-icon dx-icon-activefolder"/><span>Drive C:</span></div></div>
      <DxSortable
        filter=".dx-treeview-item"
        group="shared"
        data="driveC"
        :allow-drop-inside-item="true"
        :allow-reordering="true"
        @drag-change="onDragChange"
        @drag-end="onDragEnd"
      >
        <DxTreeView
          id="treeviewDriveC"
          data-structure="tree"
          :expand-nodes-recursive="false"
          ref="treeViewDriveCRef"
          :items="itemsDriveC"
          :width="250"
          :height="380"
          display-expr="name"
        />
      </DxSortable>
    </div>
    <div class="drive-panel">
      <div
        class="drive-header dx-treeview-item"
      ><div
        class="dx-treeview-item-content"
      ><i class="dx-icon dx-icon-activefolder"/><span>Drive D:</span></div></div>
      <DxSortable
        filter=".dx-treeview-item"
        group="shared"
        data="driveD"
        :allow-drop-inside-item="true"
        :allow-reordering="true"
        @drag-change="onDragChange"
        @drag-end="onDragEnd"
      >
        <DxTreeView
          id="treeviewDriveD"
          data-structure="tree"
          :expand-nodes-recursive="false"
          ref="treeViewDriveDRef"
          :items="itemsDriveD"
          :width="250"
          :height="380"
          display-expr="name"
        />
      </DxSortable>
    </div>
  </div>
</template>
<script setup lang="ts">
import { nextTick, ref } from 'vue';
import DxTreeView from 'devextreme-vue/tree-view';
import DxSortable from 'devextreme-vue/sortable';
import service from './data.js';

const itemsDriveC = ref(service.getItemsDriveC());
const itemsDriveD = ref(service.getItemsDriveD());

const treeViewDriveCRef = ref();
const treeViewDriveDRef = ref();

function onDragChange(e) {
  if (e.fromComponent === e.toComponent) {
    const fromNode = findNode(getTreeView(e.fromData), e.fromIndex);
    const toNode = findNode(getTreeView(e.toData), calculateToIndex(e));
    if (toNode !== null && isChildNode(fromNode, toNode)) {
      e.cancel = true;
    }
  }
}
function onDragEnd(e) {
  if (e.fromComponent === e.toComponent && e.fromIndex === e.toIndex) {
    return;
  }

  const fromTreeView = getTreeView(e.fromData);
  const toTreeView = getTreeView(e.toData);

  const fromNode = findNode(fromTreeView, e.fromIndex);
  const toNode = findNode(toTreeView, calculateToIndex(e));

  if (e.dropInsideItem && toNode !== null && !toNode.itemData.isDirectory) {
    return;
  }

  const fromTopVisibleNode = getTopVisibleNode(e.fromComponent);
  const toTopVisibleNode = getTopVisibleNode(e.toComponent);

  const fromItems = getItems(e.fromData);
  const toItems = getItems(e.toData);

  moveNode(fromNode, toNode, fromItems, toItems, e.dropInsideItem);

  itemsDriveC.value = [].concat(itemsDriveC.value);
  itemsDriveD.value = [].concat(itemsDriveD.value);

  nextTick().then(() => {
    fromTreeView.scrollToItem(fromTopVisibleNode);
    toTreeView.scrollToItem(toTopVisibleNode);
  });
}
function getTreeView(driveName) {
  return driveName === 'driveC'
    ? treeViewDriveCRef.value.instance
    : treeViewDriveDRef.value.instance;
}
function getItems(driveName) {
  return driveName === 'driveC'
    ? itemsDriveC.value
    : itemsDriveD.value;
}
function calculateToIndex(e) {
  if (e.fromComponent !== e.toComponent || e.dropInsideItem) {
    return e.toIndex;
  }

  return e.fromIndex >= e.toIndex
    ? e.toIndex
    : e.toIndex + 1;
}
function findNode(treeView, index) {
  const nodeElement = treeView.element().querySelectorAll('.dx-treeview-node')[index];
  if (nodeElement) {
    return findNodeById(treeView.getNodes(), nodeElement.getAttribute('data-item-id'));
  }
  return null;
}
function findNodeById(nodes, id) {
  for (let i = 0; i < nodes.length; i += 1) {
    if (nodes[i].itemData.id === id) {
      return nodes[i];
    }
    if (nodes[i].children) {
      const node = findNodeById(nodes[i].children, id);
      if (node != null) {
        return node;
      }
    }
  }
  return null;
}
function moveNode(fromNode, toNode, fromItems, toItems, isDropInsideItem) {
  const fromNodeContainingArray = getNodeContainingArray(fromNode, fromItems);
  const fromIndex = fromNodeContainingArray
    .findIndex((item) => item.id === fromNode.itemData.id);
  fromNodeContainingArray.splice(fromIndex, 1);

  if (isDropInsideItem) {
    toNode.itemData.items.splice(toNode.itemData.items.length, 0, fromNode.itemData);
  } else {
    const toNodeContainingArray = getNodeContainingArray(toNode, toItems);
    const toIndex = toNode === null
      ? toNodeContainingArray.length
      : toNodeContainingArray.findIndex((item) => item.id === toNode.itemData.id);
    toNodeContainingArray.splice(toIndex, 0, fromNode.itemData);
  }
}
function getNodeContainingArray(node, rootArray) {
  return node === null || node.parent === null
    ? rootArray
    : node.parent.itemData.items;
}
function isChildNode(parentNode, childNode) {
  let { parent } = childNode;
  while (parent !== null) {
    if (parent.itemData.id === parentNode.itemData.id) {
      return true;
    }
    parent = parent.parent;
  }
  return false;
}
function getTopVisibleNode(component) {
  const treeViewElement = component.element();
  const treeViewTopPosition = treeViewElement.getBoundingClientRect().top;
  const nodes = treeViewElement.querySelectorAll('.dx-treeview-node');
  for (let i = 0; i < nodes.length; i += 1) {
    const nodeTopPosition = nodes[i].getBoundingClientRect().top;
    if (nodeTopPosition >= treeViewTopPosition) {
      return nodes[i];
    }
  }

  return null;
}
</script>
<style scoped>
.form {
  display: flex;
}

.form > div {
  display: inline-block;
  vertical-align: top;
}

#treeviewDriveC,
#treeviewDriveD {
  margin-top: 10px;
}

.drive-header {
  min-height: auto;
  padding: 0;
  cursor: default;
}

.drive-panel {
  padding: 20px 30px;
  font-size: 115%;
  font-weight: bold;
  border-right: 1px solid rgba(165, 165, 165, 0.4);
  height: 100%;
}

.drive-panel:last-of-type {
  border-right: none;
}
</style>
