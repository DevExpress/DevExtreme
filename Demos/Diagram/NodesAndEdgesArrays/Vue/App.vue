<template>
  <DxDiagram
    id="diagram"
    ref="diagram"
  >
    <DxNodes
      :data-source="flowNodesDataSource"
      :text-expr="'text'"
      :type-expr="'type'"
    >
      <DxAutoLayout :type="'layered'"/>
    </DxNodes>
    <DxEdges
      :data-source="flowEdgesDataSource"
      :text-expr="'text'"
      :from-expr="'fromId'"
      :to-expr="'toId'"
    />
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
  DxDiagram, DxNodes, DxAutoLayout, DxEdges, DxToolbox, DxGroup,
} from 'devextreme-vue/diagram';
import ArrayStore from 'devextreme/data/array_store';
import service from './data.ts';

const flowNodesDataSource = new ArrayStore({
  key: 'id',
  data: service.getFlowNodes(),
});
const flowEdgesDataSource = new ArrayStore({
  key: 'id',
  data: service.getFlowEdges(),
});
</script>
<style scoped>
    #diagram {
      height: 725px;
    }
</style>
