<template>
  <div>
    <DxTreeView
      :data-source="dataSource"
      :virtual-mode-enabled="true"
      data-structure="plain"
      key-expr="Id"
      display-expr="Name"
      parent-id-expr="CategoryId"
      has-items-expr="IsGroup"
    />
  </div>
</template>
<script setup lang="ts">
import DataSource from 'devextreme/data/data_source';
import ODataStore from 'devextreme/data/odata/store';
import DxTreeView from 'devextreme-vue/tree-view';

const dataSource = new DataSource({
  store: new ODataStore({
    version: 2,
    url: 'https://js.devexpress.com/Demos/WidgetsGallery/odata/HierarchicalItems',
  }),
});
</script>
