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
          data-structure="plain"
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
          data-structure="plain"
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
import DxTreeView, { type DxTreeViewTypes } from 'devextreme-vue/tree-view';
import DxSortable, { type DxSortableTypes } from 'devextreme-vue/sortable';

import service from './data.ts';
import type { FileSystemItem } from './types';

type DxSortableInstance = DxSortable['instance'];
type Node = DxTreeViewTypes.Node<FileSystemItem>;

const treeViewDriveCRef = ref();
const treeViewDriveDRef = ref();
const itemsDriveC = ref(service.getItemsDriveC());
const itemsDriveD = ref(service.getItemsDriveD());

function onDragChange(e: DxSortableTypes.DragChangeEvent) {
  if (e.fromComponent === e.toComponent) {
    const fromNode = findNode(getTreeView(e.fromData), e.fromIndex || 0);
    const toNode = findNode(getTreeView(e.toData), calculateToIndex(e));
    if (toNode !== null && fromNode && isChildNode(fromNode, toNode)) {
      e.cancel = true;
    }
  }
}
function onDragEnd(e: DxSortableTypes.DragEndEvent) {
  if (e.fromComponent === e.toComponent && e.fromIndex === e.toIndex) {
    return;
  }

  const fromTreeView = getTreeView(e.fromData);
  const toTreeView = getTreeView(e.toData);

  const fromNode = findNode(fromTreeView, e.fromIndex || 0);
  const toNode = findNode(toTreeView, calculateToIndex(e));

  if (e.dropInsideItem && toNode !== null && !toNode.itemData?.isDirectory) {
    return;
  }

  const fromTopVisibleNode = getTopVisibleNode(e.fromComponent as DxSortableInstance);
  const toTopVisibleNode = getTopVisibleNode(e.toComponent as DxSortableInstance);

  const fromItems = getItems(e.fromData);
  const toItems = getItems(e.toData);
  if (fromNode) {
    moveNode(fromNode, toNode, fromItems, toItems, e.dropInsideItem);
  }

  itemsDriveC.value = [...itemsDriveC.value];
  itemsDriveD.value = [...itemsDriveD.value];

  nextTick().then(() => {
    fromTreeView.scrollToItem(fromTopVisibleNode);
    toTreeView.scrollToItem(toTopVisibleNode);
  });
}
function getTreeView(driveName: string) {
  return driveName === 'driveC'
    ? treeViewDriveCRef.value.instance
    : treeViewDriveDRef.value.instance;
}
function getItems(driveName: string) {
  return driveName === 'driveC'
    ? itemsDriveC.value
    : itemsDriveD.value;
}
function calculateToIndex(e: DxSortableTypes.DragEndEvent | DxSortableTypes.DragChangeEvent) {
  if (e.fromComponent !== e.toComponent || e.dropInsideItem) {
    return e.toIndex || 0;
  }

  return (e.fromIndex || 0) >= (e.toIndex || 0)
    ? e.toIndex || 0
    : (e.toIndex || 0) + 1;
}
function findNode(treeView: DxTreeView['instance'], index: number) {
  const nodeElement = treeView?.element()?.querySelectorAll('.dx-treeview-node')[index];
  if (nodeElement) {
    return findNodeById(treeView.getNodes(), nodeElement.getAttribute('data-item-id') || '');
  }
  return null;
}
function findNodeById(nodes: Node[], id: string): Node | null {
  for (let i = 0; i < nodes.length; i += 1) {
    if (nodes[i].itemData?.id === id) {
      return nodes[i];
    }
    if (nodes[i].children) {
      const nodeChildren = nodes[i].children;
      const node = nodeChildren ? findNodeById(nodeChildren, id) : null;

      if (node) {
        return node;
      }
    }
  }
  return null;
}
function moveNode(fromNode: Node, toNode: Node, fromItems, toItems, isDropInsideItem) {
  const fromIndex = fromItems.findIndex((item) => item.id === fromNode.itemData.id);
  fromItems.splice(fromIndex, 1);

  const toIndex = toNode === null || isDropInsideItem
    ? toItems.length
    : toItems.findIndex((item) => item.id === toNode.itemData?.id);
  toItems.splice(toIndex, 0, fromNode.itemData);

  moveChildren(fromNode, fromItems, toItems);
  if (isDropInsideItem && toNode && fromNode.itemData) {
    fromNode.itemData.parentId = toNode.itemData?.id;
  } else if (fromNode.itemData) {
    fromNode.itemData.parentId = toNode != null
      ? toNode.itemData?.parentId
      : undefined;
  }
}
function moveChildren(node: Node, fromDataSource: DriveItem[], toDataSource: any[]) {
  if (!node.itemData?.isDirectory) {
    return;
  }

  node.children?.forEach((child) => {
    if (child.itemData?.isDirectory) {
      moveChildren(child, fromDataSource, toDataSource);
    }

    const fromIndex = fromDataSource.findIndex((item) => item.id === child.itemData?.id);
    if (fromIndex !== -1) {
      fromDataSource.splice(fromIndex, 1);
      toDataSource.splice(toDataSource.length, 0, child.itemData);
    }
  });
}
function isChildNode(parentNode: Node, childNode: Node) {
  let { parent } = childNode;
  while (parent) {
    if (parent.itemData?.id === parentNode.itemData?.id) {
      return true;
    }
    parent = parent.parent;
  }
  return false;
}
function getTopVisibleNode(component: DxSortableInstance) {
  if (component) {
    const treeViewElement = component.element();
    const treeViewTopPosition = treeViewElement.getBoundingClientRect().top;
    const nodes = treeViewElement.querySelectorAll('.dx-treeview-node');
    for (let i = 0; i < nodes.length; i += 1) {
      const nodeTopPosition = nodes[i].getBoundingClientRect().top;
      if (nodeTopPosition >= treeViewTopPosition) {
        return nodes[i];
      }
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

.dx-treeview-item {
  box-sizing: border-box;
}

.drive-header {
  min-height: auto;
  padding: 0;
  cursor: default;
  margin-bottom: 10px;
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
