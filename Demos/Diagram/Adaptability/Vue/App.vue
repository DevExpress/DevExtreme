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
    DxDiagram
  },
  mounted() {
    var diagram = this.$refs['diagram'].instance;
    fetch('../../../../data/diagram-flow.json')
      .then(function(response) {
        return response.json();
      })
      .then(function(json) {
        diagram.import(JSON.stringify(json));
      })
      .catch(function() {
        throw 'Data Loading Error';
      });
  }
};
</script>
<style scoped>
    .demo-container,
    #app,
    #diagram {
        height: 100%;
    }
</style>
