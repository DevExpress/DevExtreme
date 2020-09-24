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
        key: 'id',
        data: service.getOrgItems()
      }),
      orgLinksDataSource: new ArrayStore({
        key: 'id',
        data: service.getOrgLinks()
      })
    };
  },
  methods: {
    itemTypeExpr(obj, value) {
      if(value) {
        obj.type = (value === 'rectangle') ? undefined : 'group';
      } else {
        return obj.type === 'group' ? 'ellipse' : 'rectangle';
      }
    },
    itemWidthExpr(obj, value) {
      if(value) {
        obj.width = value;
      } else {
        return obj.width || (obj.type === 'group' && 1.5) || 1;
      }
    },
    itemHeightExpr(obj, value) {
      if(value) {
        obj.height = value;
      } else {
        return obj.height || (obj.type === 'group' && 1) || 0.75;
      }
    },
    itemTextStyleExpr(obj) {
      if(obj.level === 'senior') {
        return { 'font-weight': 'bold', 'text-decoration': 'underline' };
      }
      return {};
    },
    itemStyleExpr(obj) {
      let style = { 'stroke': '#444444' };
      if(obj.type === 'group') {
        style['fill'] = '#f3f3f3';
      }
      return style;
    },
    linkStyleExpr() {
      return { 'stroke': '#444444' };
    },
    linkFromLineEndExpr() {
      return 'none';
    },
    linkToLineEndExpr() {
      return 'none';
    }
  }
};
</script>
<style scoped>
    #diagram {
        height: 900px;
    }
</style>
