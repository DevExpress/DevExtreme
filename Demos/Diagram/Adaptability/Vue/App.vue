<template>
  <DxDiagram
    id="diagram"
    ref="diagram"
    :auto-zoom-mode="'fitWidth'"
  />
</template>
<script>
import DxDiagram from 'devextreme-vue/diagram';
import 'whatwg-fetch';

export default {
  components: {
    DxDiagram,
  },
  mounted() {
    const diagram = this.$refs.diagram.instance;
    fetch('../../../../data/diagram-flow.json')
      .then((response) => response.json())
      .then((json) => {
        diagram.import(JSON.stringify(json));
      })
      .catch(() => {
        throw 'Data Loading Error';
      });
  },
};
</script>
<style scoped>
    .demo-container,
    #app,
    #diagram {
        height: 100%;
    }
</style>
