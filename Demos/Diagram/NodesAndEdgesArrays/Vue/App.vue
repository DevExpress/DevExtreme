<template>
  <DxDiagram
    id="diagram"
    ref="diagram"
  >
    <DxNodes :data-source="orgItemsDataSource">
      <DxAutoLayout :type="'tree'"/>
    </DxNodes>
    <DxEdges :data-source="orgLinksDataSource"/>
    <DxToolbox>
      <DxGroup
        :category="'general'"
        :title="'General'"
      />
    </DxToolbox>
  </DxDiagram>
</template>
<script>
import { DxDiagram, DxNodes, DxAutoLayout, DxEdges, DxToolbox, DxGroup } from 'devextreme-vue/diagram';
import ArrayStore from 'devextreme/data/array_store';
import service from './data.js';

export default {
  components: {
    DxDiagram, DxNodes, DxAutoLayout, DxEdges, DxToolbox, DxGroup
  },
  data() {
    return {
      orgItemsDataSource: new ArrayStore({
        key: 'this',
        data: service.getOrgItems()
      }),
      orgLinksDataSource: new ArrayStore({
        key: 'this',
        data: service.getOrgLinks()
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
