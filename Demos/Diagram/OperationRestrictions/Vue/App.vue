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
      if(e.operation === 'addShape') {
        if(e.args.shape.type !== 'employee' && e.args.shape.type !== 'team') {
          !e.updateUI && this.showToast('You can add only a \'Team\' or \'Employee\' shape.');
          e.allowed = false;
        }
      }
      else if(e.operation === 'deleteShape') {
        var dataItem = e.args.shape && e.args.shape.dataItem;
        if(dataItem && dataItem.Type === 'root') {
          !e.updateUI && this.showToast('You cannot delete the \'Development\' shape.');
          e.allowed = false;
        }
        if(dataItem && dataItem.Type === 'team') {
          var children = service.getOrgItems().filter(function(item) {
            return item.ParentID === dataItem.ID;
          });
          if(children.length > 0) {
            !e.updateUI && this.showToast('You cannot delete a \'Team\' shape that has a child shape.');
            e.allowed = false;
          }
        }
      }
      else if(e.operation === 'resizeShape') {
        if(e.args.newSize.width < 1 || e.args.newSize.height < 0.75) {
          !e.updateUI && this.showToast('The shape size is too small.');
          e.allowed = false;
        }
      }
      else if(e.operation === 'changeConnection') {
        var dataItem = e.args.newShape && e.args.newShape.dataItem;
        if(dataItem && dataItem.Type === 'root' && e.args.connectorPosition === 'end') {
          !e.updateUI && this.showToast('The \'Development\' shape cannot have an incoming connection.');
          e.allowed = false;
        }
        if(dataItem && dataItem.Type === 'team' && e.args.connectorPosition === 'end') {
          if(dataItem && dataItem.ParentID !== undefined && dataItem.ParentID !== null) {
            !e.updateUI && this.showToast('A \'Team\' shape can have only one incoming connection.');
            e.allowed = false;
          }
        }
        if(dataItem && dataItem.Type === 'employee') {
          if(e.args.connectorPosition === 'start') {
            e.allowed = false;
          }
          if(e.args.connectorPosition === 'end' && dataItem.ParentID !== undefined && dataItem.ParentID !== null) {
            !e.updateUI && this.showToast('An \'Employee\' shape can have only one incoming connection.');
            e.allowed = false;
          }
        }
      }
      else if(e.operation === 'changeConnectorPoints') {
        if(e.args.newPoints.length > 2) {
          !e.updateUI && this.showToast('You cannot add points to a connector.');
          e.allowed = false;
        }
      }
      else if(e.operation === 'beforeChangeShapeText') {
        var dataItem = e.args.shape && e.args.shape.dataItem;
        if(dataItem && dataItem.Type === 'root') {
          !e.updateUI && this.showToast('You cannot change the \'Development\' shape\'s text.');
          e.allowed = false;
        }
      }
      else if(e.operation === 'changeShapeText') {
        if(e.args.text === '') {
          !e.updateUI && this.showToast('A shape text cannot be empty.');
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
