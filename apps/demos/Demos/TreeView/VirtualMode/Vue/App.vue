<template>
  <div>
    <DxTreeView
      :data-source="dataSource"
      :virtual-mode-enabled="true"
      data-structure="plain"
      key-expr="ID"
      display-expr="Text"
      parent-id-expr="CategoryId"
      has-items-expr="IsGroup"
      :root-value="null"
    />
  </div>
</template>
<script setup lang="ts">
import DxTreeView from 'devextreme-vue/tree-view';
import { createStore } from 'devextreme-aspnet-data-nojquery';

const dataSource = createStore({
  loadUrl: 'https://js.devexpress.com/Demos/NetCore/api/TreeViewPlainData',
  key: 'ID',
});
</script>
