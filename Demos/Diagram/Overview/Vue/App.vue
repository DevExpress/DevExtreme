<template>
  <DxDiagram
    id="diagram"
    ref="diagram"
  />
</template>
<script>
import { DxDiagram } from 'devextreme-vue';
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
    #diagram {
        height: 900px;
    }
</style>
