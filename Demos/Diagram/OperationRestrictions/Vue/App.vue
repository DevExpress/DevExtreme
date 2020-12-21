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
      :key-expr="'ID'"
      :text-expr="'Name'"
      :type-expr="'Type'"
      :parent-key-expr="'ParentID'"
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
        key: 'ID',
        data: service.getOrgItems()
      })
    };
  },
  methods: {
    showToast(text) {
      notify({
        position: { at: 'top', my: 'top', of: '#diagram', offset: '0 4' },
        message: text,
        type: 'warning',
        delayTime: 2000
      });
    },
    isParent(shapeToTest, shape) {
      if(shapeToTest.id === shape.id) return true;

      var diagram = this.$refs['diagram'].instance;
      for(var i = 0; i < shapeToTest.attachedConnectorIds.length; i++) {
        var connector = diagram.getItemById(shapeToTest.attachedConnectorIds[i]);
        if(connector.fromId === shapeToTest.id && connector.toId) {
          var childShape = diagram.getItemById(connector.toId);
          if(childShape.id === shape.id || this.isParent(childShape, shape)) {
            return true;
          }
        }
      }
      return false;
    },
    onRequestLayoutUpdate(e) {
      for(var i = 0; i < e.changes.length; i++) {
        if(e.changes[i].type === 'remove') {
          e.allowed = true;
        } else if(e.changes[i].data.ParentID !== undefined && e.changes[i].data.ParentID !== null) {
          e.allowed = true;
        }
      }
    },
    onRequestEditOperation(e) {
      var diagram = this.$refs['diagram'].instance;
      var i;
      if(e.operation === 'addShape') {
        if(e.args.shape.type !== 'employee' && e.args.shape.type !== 'team') {
          if(e.reason !== 'checkUIElementAvailability') {
            this.showToast('You can add only a \'Team\' or \'Employee\' shape.');
          }
          e.allowed = false;
        }
      }
      else if(e.operation === 'deleteShape') {
        if(e.args.shape.type === 'root') {
          if(e.reason !== 'checkUIElementAvailability') {
            this.showToast('You cannot delete the \'Development\' shape.');
          }
          e.allowed = false;
        }
        if(e.args.shape.type === 'team') {
          for(i = 0; i < e.args.shape.attachedConnectorIds.length; i++) {
            if(diagram.getItemById(e.args.shape.attachedConnectorIds[i]).toId != e.args.shape.id) {
              if(e.reason !== 'checkUIElementAvailability') {
                this.showToast('You cannot delete a \'Team\' shape that has a child shape.');
              }
              e.allowed = false;
              break;
            }
          }
        }
      }
      else if(e.operation === 'resizeShape') {
        if(e.args.newSize.width < 1 || e.args.newSize.height < 0.75) {
          if(e.reason !== 'checkUIElementAvailability') {
            this.showToast('The shape size is too small.');
          }
          e.allowed = false;
        }
      }
      else if(e.operation === 'changeConnection') {
        var shapeType = e.args.newShape && e.args.newShape.type;
        if(shapeType === 'root' && e.args.connectorPosition === 'end') {
          if(e.reason !== 'checkUIElementAvailability') {
            this.showToast('The \'Development\' shape cannot have an incoming connection.');
          }
          e.allowed = false;
        }
        if(shapeType === 'team') {
          if(e.args.connectorPosition === 'end' && e.args.newShape.attachedConnectorIds.length > 1) {
            for(i = 0; i < e.args.newShape.attachedConnectorIds.length; i++) {
              if(e.args.connector && e.args.newShape.attachedConnectorIds[i] != e.args.connector.id) {
                var connector = diagram.getItemById(e.args.newShape.attachedConnectorIds[i]);
                if(connector.toId === e.args.newShape.id) {
                  if(e.reason !== 'checkUIElementAvailability') {
                    this.showToast('A \'Team\' shape can have only one incoming connection.');
                  }
                  e.allowed = false;
                  break;
                }
              }
            }
          }
          if(e.allowed && e.args.connector && e.args.connector.fromId && e.args.connector.toId) {
            var shapeFrom = diagram.getItemById(e.args.connector.fromId);
            var shapeTo = diagram.getItemById(e.args.connector.toId);
            if(this.isParent(shapeTo, shapeFrom)) {
              if(e.reason !== 'checkUIElementAvailability') {
                this.showToast('A circular reference is not allowed.');
              }
              e.allowed = false;
            }
          }
        }
        if(shapeType === 'employee') {
          if(e.args.connectorPosition === 'start') {
            e.allowed = false;
          }

          if(e.args.connectorPosition === 'end' && e.args.newShape.attachedConnectorIds.length > 1) {
            if(e.reason !== 'checkUIElementAvailability') {
              this.showToast('An \'Employee\' shape can have only one incoming connection.');
            }
            e.allowed = false;
          }
        }
      }
      else if(e.operation === 'changeConnectorPoints') {
        if(e.args.newPoints.length > 2) {
          if(e.reason !== 'checkUIElementAvailability') {
            this.showToast('You cannot add points to a connector.');
          }
          e.allowed = false;
        }
      }
      else if(e.operation === 'beforeChangeShapeText') {
        if(e.args.shape.type === 'root') {
          if(e.reason !== 'checkUIElementAvailability') {
            this.showToast('You cannot change the \'Development\' shape\'s text.');
          }
          e.allowed = false;
        }
      }
      else if(e.operation === 'changeShapeText') {
        if(e.args.text === '') {
          if(e.reason !== 'checkUIElementAvailability') {
            this.showToast('A shape text cannot be empty.');
          }
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
