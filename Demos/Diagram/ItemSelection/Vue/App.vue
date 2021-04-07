<template>
  <div>
    <DxDiagram
      id="diagram"
      ref="diagram"
      @content-ready="onContentReady"
      @selection-changed="onSelectionChanged"
    >
      <DxNodes
        :data-source="dataSource"
        :key-expr="'ID'"
        :text-expr="'Full_Name'"
        :parent-key-expr="'Head_ID'"
      >
        <DxAutoLayout
          :type="'tree'"
        />
      </DxNodes>
      <DxToolbox :visibility="'disabled'"/>
      <DxPropertiesPanel :visibility="'disabled'"/>
    </DxDiagram>
    <div class="selected-data">
      <span class="caption">Selected Items: </span>
      <span>
        {{ selectedItemNames }}
      </span>
    </div>
  </div>
</template>
<script>
import { DxDiagram, DxNodes, DxAutoLayout, DxToolbox, DxPropertiesPanel } from 'devextreme-vue/diagram';
import ArrayStore from 'devextreme/data/array_store';
import service from './data.js';

export default {
  components: {
    DxDiagram, DxNodes, DxAutoLayout, DxToolbox, DxPropertiesPanel
  },
  data() {
    return {
      dataSource: new ArrayStore({
        key: 'ID',
        data: service.getEmployees()
      }),
      selectedItemNames: 'Nobody has been selected'
    };
  },
  methods: {
    onContentReady(e) {
      var diagram = e.component;
      // preselect some shape
      var items = diagram.getItems().filter(function(item) {
        return item.itemType === 'shape' && (item.text === 'Greta Sims');
      });
      if(items.length > 0) {
        diagram.setSelectedItems(items);
        diagram.scrollToItem(items[0]);
        diagram.focus();
      }
    },
    onSelectionChanged({ items }) {
      this.selectedItemNames = 'Nobody has been selected';
      items = items
        .filter(function(item) { return item.itemType === 'shape'; })
        .map(function(item) { return item.text; });
      if(items.length > 0) {
        this.selectedItemNames = items.join(', ');
      }
    }
  }
};
</script>
<style scoped>
    #diagram {
        height: 600px;
    }

    .selected-data {
        margin-top: 20px;
        padding: 20px;
        background-color: rgba(191, 191, 191, 0.15);
    }

    .selected-data .caption {
        font-weight: bold;
        font-size: 115%;
    }
</style>
