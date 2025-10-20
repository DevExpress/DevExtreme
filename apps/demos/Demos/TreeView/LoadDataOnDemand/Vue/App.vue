<template>
  <div>
    <DxTreeView
      id="simple-treeview"
      :create-children="createChildren"
      :root-value="''"
      :height="500"
      :expand-nodes-recursive="false"
      data-structure="plain"
    />
  </div>
</template>
<script setup lang="ts">
import DxTreeView, { type DxTreeViewTypes } from 'devextreme-vue/tree-view';
import 'whatwg-fetch';

function createChildren(parent: DxTreeViewTypes.Node) {
  const parentId = parent?.itemData ? parent.itemData.id : '';

  return fetch(`https://js.devexpress.com/Demos/NetCore/api/TreeViewData?parentId=${parentId}`)
    .then((response) => response.json())
    .catch(() => { throw new Error('Data Loading Error'); });
}
</script>
