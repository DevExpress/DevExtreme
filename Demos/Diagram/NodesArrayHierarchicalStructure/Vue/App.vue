<template>
  <DxDiagram
    id="diagram"
    ref="diagram"
  >
    <DxNodes
      :data-source="dataSource"
      :text-expr="'Title'"
      :items-expr="'Items'"
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
<script>
import { DxDiagram, DxNodes, DxAutoLayout, DxToolbox, DxGroup } from 'devextreme-vue/diagram';
import ArrayStore from 'devextreme/data/array_store';
import service from './data.js';

export default {
  components: {
    DxDiagram, DxNodes, DxAutoLayout, DxToolbox, DxGroup
  },
  data() {
    return {
      dataSource: new ArrayStore({
        key: 'this',
        data: service.getEmployees()
      })
    };
  }
};
</script>
<style scoped>
    #diagram {
        height: 725px;
    }
</style>
