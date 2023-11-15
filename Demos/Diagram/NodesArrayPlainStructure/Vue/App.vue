<template>
  <DxDiagram
    id="diagram"
    ref="diagram"
  >
    <DxNodes
      :data-source="dataSource"
      :key-expr="'ID'"
      :text-expr="'Title'"
      :parent-key-expr="'Head_ID'"
    >
      <DxAutoLayout :type="'tree'"/>
    </DxNodes>
    <DxToolbox>
      <DxGroup
        :category="'general'"
        :title="'General'"
      />
    </DxToolbox>
  </DxDiagram>
</template>
<script setup lang="ts">
import {
  DxDiagram, DxNodes, DxAutoLayout, DxToolbox, DxGroup,
} from 'devextreme-vue/diagram';
import ArrayStore from 'devextreme/data/array_store';
import service from './data.js';

const dataSource = new ArrayStore({
  key: 'ID',
  data: service.getEmployees(),
});
</script>
<style scoped>
    #diagram {
      height: 725px;
    }
</style>
