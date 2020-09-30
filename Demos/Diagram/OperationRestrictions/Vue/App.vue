<template>
  <DxDiagram
    id="diagram"
    ref="diagram"
    @request-edit-operation="onRequestEditOperation"
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
    />
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
    />
  </DxDiagram>
</template>
<script>
import { DxDiagram, DxCustomShape, DxNodes, DxAutoLayout, DxContextToolbox, DxToolbox, DxPropertiesPanel, DxGroup } from 'devextreme-vue/diagram';
import notify from 'devextreme/ui/notify';
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
    onRequestLayoutUpdate(e) {
      for(var i = 0; i < e.changes.length; i++) {
        if(e.changes[i].type === 'remove') {
          e.allowed = true;
        } else if(e.changes[i].data.parentId !== undefined && e.changes[i].data.parentId !== null) {
          e.allowed = true;
        }
      }
    },
    onRequestEditOperation(e) {
      var dataItem = e.args.shape && e.args.shape.dataItem;
      if(e.operation === 'addShape') {
        if(e.args.shape.type !== 'employee' && e.args.shape.type !== 'team') {
          !e.updateUI && notify('You can add only a \'Team\' or \'Employee\' shape.', 'warning', 3000);
          e.allowed = false;
        }
      }
      else if(e.operation === 'deleteShape') {
        if(dataItem && dataItem.type === 'root') {
          !e.updateUI && notify('You cannot delete the \'Development\' shape.', 'warning', 3000);
          e.allowed = false;
        }
        if(dataItem && dataItem.type === 'team') {
          var children = service.getOrgItems().filter(function(item) {
            return item.parentId === dataItem.id;
          });
          if(children.length > 0) {
            !e.updateUI && notify('You cannot delete a \'Team\' shape that has a child shape.', 'warning', 3000);
            e.allowed = false;
          }
        }
      }
      else if(e.operation === 'resizeShape') {
        if(e.args.newSize.width < 1 || e.args.newSize.height < 0.75) {
          !e.updateUI && notify('The shape size is too small.', 'warning', 3000);
          e.allowed = false;
        }
      }
      else if(e.operation === 'changeConnection') {
        if(dataItem && dataItem.type === 'root' && e.args.connectorPosition === 'end') {
          !e.updateUI && notify('The \'Development\' shape cannot have an incoming connection.', 'warning', 3000);
          e.allowed = false;
        }
        if(dataItem && dataItem.type === 'team' && e.args.connectorPosition === 'end') {
          if(dataItem && dataItem.parentId !== undefined && dataItem.parentId !== null) {
            !e.updateUI && notify('A \'Team\' shape can have only one incoming connection.', 'warning', 3000);
            e.allowed = false;
          }
        }
        if(dataItem && dataItem.type === 'employee') {
          if(e.args.connectorPosition === 'start') {
            e.allowed = false;
          }
          if(e.args.connectorPosition === 'end' && dataItem.parentId !== undefined && dataItem.parentId !== null) {
            !e.updateUI && notify('An \'Employee\' shape can have only one incoming connection.', 'warning', 3000);
            e.allowed = false;
          }
        }
      }
      else if(e.operation === 'changeConnectorPoints') {
        if(e.args.newPoints.length > 2) {
          !e.updateUI && notify('You cannot add points to a connector.', 'warning', 3000);
          e.allowed = false;
        }
      }
      else if(e.operation === 'beforeChangeShapeText') {
        if(dataItem && dataItem.type === 'root') {
          !e.updateUI && notify('You cannot change the \'Development\' shape\'s text.', 'warning', 3000);
          e.allowed = false;
        }
      }
      else if(e.operation === 'changeShapeText') {
        if(e.args.text === '') {
          !e.updateUI && notify('A shape text cannot be empty.', 'warning', 3000);
          e.allowed = false;
        }
      }
      else if(e.operation === 'beforeChangeConnectorText') {
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
