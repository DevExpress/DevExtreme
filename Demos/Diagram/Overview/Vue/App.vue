<template>
  <DxDiagram
    id="diagram"
    ref="diagram"
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
        throw new Error('Data Loading Error');
      });
  },
};
</script>
<style scoped>
    #diagram {
        height: 900px;
    }
</style>
