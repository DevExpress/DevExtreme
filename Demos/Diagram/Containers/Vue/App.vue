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
<script>
import { DxDiagram, DxToolbox, DxGroup } from 'devextreme-vue/diagram';
import 'whatwg-fetch';

export default {
  components: {
    DxDiagram, DxToolbox, DxGroup
  },
  mounted() {
    var diagram = this.$refs['diagram'].instance;
    fetch('../../../../data/diagram-structure.json')
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
        height: 725px;
    }
</style>
