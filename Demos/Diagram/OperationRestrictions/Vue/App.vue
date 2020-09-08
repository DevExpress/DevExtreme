<template>
  <DxDiagram
    id="diagram"
    ref="diagram"
    @request-operation="onRequestOperation"
    @request-layout-update="onRequestLayoutUpdate"
  >
    <DxCustomShape
      :category="'items'"
      :type="'root'"
      :base-type="'octagon'"
      :default-text="'Development'"
    />
    <DxCustomShape
      :category="'items'"
      :type="'team'"
      :base-type="'ellipse'"
      :title="'Team'"
      :default-text="'Team Name'"
    />
    <DxCustomShape
      :category="'items'"
      :type="'employee'"
      :base-type="'rectangle'"
      :title="'Employee'"
      :default-text="'Employee Name'"
    />
    <DxNodes
      :data-source="orgItemsDataSource"
      :type-expr="itemTypeExpr"
      :text-expr="'name'"
      :parent-key-expr="'parentId'"
    >
      <DxAutoLayout
        :type="'tree'"
      />
    </DxNodes>
    <DxContextToolbox
      :shape-icons-per-row="2"
      :width="100"
      :shapes="['team', 'employee']"
    >
    </DxContextToolbox>
    <DxToolbox 
      :shape-icons-per-row="2"
    >
      <DxGroup
        :title="'Items'"
        :shapes="['team', 'employee']"
      />
    </DxToolbox>
    <DxPropertiesPanel
      :visibility="'disabled'"
    >
    </DxPropertiesPanel>
  </DxDiagram>
</template>
<script>
import { DxDiagram, DxCustomShape, DxNodes, DxAutoLayout, DxContextToolbox, DxToolbox, DxPropertiesPanel, DxGroup } from 'devextreme-vue/diagram';
import ArrayStore from 'devextreme/data/array_store';
import service from './data.js';

export default {
  components: {
    DxDiagram, DxCustomShape, DxNodes, DxAutoLayout, DxContextToolbox, DxToolbox, DxPropertiesPanel, DxGroup
  },
  data() {
    return {
      orgItemsDataSource: new ArrayStore({
        key: 'id',
        data: service.getOrgItems()
      })
    };
  },
  methods: {
    itemTypeExpr(obj, value) {
      if(value) {
        if(value !== 'employee') {
          obj.type = value;
        } else {
          obj.type = undefined;
        }
      } else {
        if(obj.type !== undefined) {
          return obj.type;
        }
        return 'employee';
      }
    },
    onRequestLayoutUpdate(e) {
      for(var i = 0; i < e.changes.length; i++) {
        if(e.changes[i].type === 'remove') {
          e.allowed = true;
        } else if(e.changes[i].data.parentId !== undefined && e.changes[i].data.parentId !== null) {
          e.allowed = true;
        }
      }
    },
    onRequestOperation(e) {
      if(e.operation === 'addShape') {
        if(e.args.shape.type !== 'employee' && e.args.shape.type !== 'team') {
          e.allowed = false;
        }
      } else if(e.operation === 'deleteShape') {
        if(e.args.shape.dataItem && e.args.shape.dataItem.type === 'root') {
          e.allowed = false;
        }
        if(e.args.shape.dataItem && e.args.shape.dataItem.type === 'team') {
          var children = service.getOrgItems().filter(function(item) {
            return item.parentId === e.args.shape.dataItem.id;
          });
          if(children.length > 0) {
            e.allowed = false;
          }
        }
      } else if(e.operation === 'deleteConnector') {
        e.allowed = false;
      } else if(e.operation === 'changeConnection') {
        if(e.args.connectorPosition === 'end' && e.args.shape === undefined) {
          e.allowed = false;
        }
        if(e.args.shape.dataItem && e.args.shape.dataItem.type === 'root' && e.args.connectorPosition === 'end') {
          e.allowed = false;
        }
        if(e.args.shape.dataItem && e.args.shape.dataItem.type === undefined) {
          if(e.args.connectorPosition === 'start') {
            e.allowed = false;
          }
          if(e.args.connectorPosition === 'end' && e.args.shape.dataItem.parentId !== undefined && e.args.shape.dataItem.parentId !== null) {
            e.allowed = false;
          }
        }
      } else if(e.operation === 'changeConnectorPoints') {
        if(e.args.newPoints.length > 2) {
          e.allowed = false;
        }
      } else if(e.operation === 'beforeChangeShapeText') {
        if(e.args.shape.dataItem && e.args.shape.dataItem.type === 'root') {
          e.allowed = false;
        }
      } else if(e.operation === 'changeShapeText') {
        if(e.args.text === '') {
          e.allowed = false;
        }
      } else if(e.operation === 'beforeChangeConnectorText') {
        e.allowed = false;
      }
    }
  }
};
</script>
<style scoped>
    #diagram {
        height: 600px;
    }
</style>
