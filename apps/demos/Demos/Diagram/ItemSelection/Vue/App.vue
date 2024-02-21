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
      <span class="caption">Selected Items:</span>{{ ' ' }}
      <span>
        {{ selectedItemNames }}
      </span>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import {
  DxDiagram, DxNodes, DxAutoLayout, DxToolbox, DxPropertiesPanel,
} from 'devextreme-vue/diagram';
import ArrayStore from 'devextreme/data/array_store';
import service from './data.ts';

const dataSource = new ArrayStore({
  key: 'ID',
  data: service.getEmployees(),
});
const selectedItemNames = ref('Nobody has been selected');

function onContentReady(e) {
  const diagram = e.component;
  // preselect some shape
  const items = diagram.getItems().filter(({ itemType, text }) => itemType === 'shape' && (text === 'Greta Sims'));
  if (items.length > 0) {
    diagram.setSelectedItems(items);
    diagram.scrollToItem(items[0]);
    diagram.focus();
  }
}
function onSelectionChanged({ items }) {
  selectedItemNames.value = 'Nobody has been selected';
  const filteredItems = items
    .filter((item) => item.itemType === 'shape')
    .map((item) => item.text);
  if (filteredItems.length > 0) {
    selectedItemNames.value = filteredItems.join(', ');
  }
}
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
