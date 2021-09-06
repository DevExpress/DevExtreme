<template>
  <DxDiagram
    id="diagram"
    ref="diagram"
    :read-only="true"
  />
</template>
<script>
import { DxDiagram } from 'devextreme-vue/diagram';
import 'whatwg-fetch';

export default {
  components: {
    DxDiagram,
  },
  mounted() {
    const diagram = this.$refs.diagram.instance;
    fetch('../../../../data/diagram-structure.json')
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
    #diagram {
        height: 700px;
    }
</style>
