<template>
  <DxDiagram
    id="diagram"
    ref="diagram"
    :auto-zoom-mode="'fitWidth'"
  />
</template>
<script setup lang="ts">
import { watch, ref } from 'vue';
import DxDiagram from 'devextreme-vue/diagram';
import 'whatwg-fetch';

const diagram = ref();

watch(diagram,
  ({ instance }) => {
    fetch('../../../../data/diagram-flow.json')
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
    .demo-container,
    #app,
    #diagram {
      height: 100%;
    }
</style>
