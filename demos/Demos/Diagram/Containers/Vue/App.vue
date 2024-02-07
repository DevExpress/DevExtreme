<template>
  <DxDiagram
    id="diagram"
    ref="diagram"
  >
    <DxToolbox :visible="true">
      <DxGroup
        :category="'general'"
        :title="'General'"
      />
      <DxGroup
        :category="'containers'"
        :title="'Containers'"
        :expanded="true"
      />
    </DxToolbox>
  </DxDiagram>
</template>
<script setup lang="ts">
import { watch, ref } from 'vue';
import { DxDiagram, DxToolbox, DxGroup } from 'devextreme-vue/diagram';
import 'whatwg-fetch';

const diagram = ref();

watch(diagram,
  ({ instance }) => {
    fetch('../../../../data/diagram-structure.json')
      .then((response) => response.json())
      .then((json) => {
        instance.import(JSON.stringify(json));
      })
      .catch(() => {
        throw new Error('Data Loading Error');
      });
  });
</script>
<style scoped>
    #diagram {
      height: 725px;
    }
</style>
