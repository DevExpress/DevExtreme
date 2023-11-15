<template>
  <DxDiagram
    id="diagram"
    ref="diagram"
  >
    <DxNodes
      :data-source="orgItemsDataSource"
      :type-expr="itemTypeExpr"
      :text-expr="'name'"
      :width-expr="itemWidthExpr"
      :height-expr="itemHeightExpr"
      :text-style-expr="itemTextStyleExpr"
      :style-expr="itemStyleExpr"
    >
      <DxAutoLayout
        :type="'tree'"
        :orientation="'horizontal'"
      />
    </DxNodes>
    <DxEdges
      :data-source="orgLinksDataSource"
      :from-line-end-expr="linkFromLineEndExpr"
      :to-line-end-expr="linkToLineEndExpr"
      :style-expr="linkStyleExpr"
    />
    <DxToolbox>
      <DxGroup
        :category="'general'"
        :title="'General'"
      />
    </DxToolbox>
  </DxDiagram>
</template>
<script setup lang="ts">
import {
  DxDiagram, DxNodes, DxAutoLayout, DxEdges, DxToolbox, DxGroup,
} from 'devextreme-vue/diagram';
import ArrayStore from 'devextreme/data/array_store';
import service from './data.js';

const orgItemsDataSource = new ArrayStore({
  key: 'id',
  data: service.getOrgItems(),
});
const orgLinksDataSource = new ArrayStore({
  key: 'id',
  data: service.getOrgLinks(),
});

const linkStyleExpr = () => ({ stroke: '#444444' });
const linkFromLineEndExpr = () => 'none';
const linkToLineEndExpr = () => 'none';
const itemTextStyleExpr = (obj) => (obj.level === 'senior'
  ? { 'font-weight': 'bold', 'text-decoration': 'underline' }
  : {}
);
const itemStyleExpr = ({ type }) => ({
  stroke: '#444444',
  ...(type === 'group' ? { fill: '#f3f3f3' } : {}),
});

function itemTypeExpr(obj, value) {
  if (value) {
    obj.type = (value === 'rectangle') ? undefined : 'group';
  } else {
    return obj.type === 'group' ? 'ellipse' : 'rectangle';
  }
  return null;
}
function itemWidthExpr(obj, value) {
  if (value) {
    obj.width = value;
  } else {
    return obj.width || (obj.type === 'group' && 1.5) || 1;
  }
  return null;
}
function itemHeightExpr(obj, value) {
  if (value) {
    obj.height = value;
  } else {
    return obj.height || (obj.type === 'group' && 1) || 0.75;
  }
  return null;
}
</script>
<style scoped>
    #diagram {
      height: 900px;
    }
</style>
