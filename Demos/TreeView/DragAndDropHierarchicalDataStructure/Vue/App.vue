<template>
  <div class="form">
    <div class="drive-panel">
      <div class="drive-header dx-treeview-item"><i class="dx-icon dx-icon-activefolder"/><span>Drive C:</span></div>
      <DxSortable
        filter=".dx-treeview-item"
        group="shared"
        data="driveC"
        :allow-drop-inside-item="true"
        :allow-reordering="true"
        @drag-change="onDragChange"
        @drag-end="onDragEnd"
      >
        <DxTreeView
          id="treeviewDriveC"
          data-structure="tree"
          :expand-nodes-recursive="false"
          :ref="treeViewDriveCRef"
          :items="itemsDriveC"
          :width="250"
          :height="380"
        >
          <template #item="item">
            <div><i :class="item.data.isDirectory ? 'dx-icon dx-icon-activefolder' : 'dx-icon dx-icon-file'"/><span>{{ item.data.name }}</span></div>
          </template>
        </DxTreeView>
      </DxSortable>
    </div>
    <div class="drive-panel">
      <div class="drive-header dx-treeview-item"><i class="dx-icon dx-icon-activefolder"/><span>Drive D:</span></div>
      <DxSortable
        filter=".dx-treeview-item"
        group="shared"
        data="driveD"
        :allow-drop-inside-item="true"
        :allow-reordering="true"
        @drag-change="onDragChange"
        @drag-end="onDragEnd"
      >
        <DxTreeView
          id="treeviewDriveD"
          data-structure="tree"
          :expand-nodes-recursive="false"
          :ref="treeViewDriveDRef"
          :items="itemsDriveD"
          :width="250"
          :height="380"
        >
          <template #item="item">
            <div><i :class="item.data.isDirectory ? 'dx-icon dx-icon-activefolder' : 'dx-icon dx-icon-file'"/><span>{{ item.data.name }}</span></div>
          </template>
        </DxTreeView>
      </DxSortable>
    </div>
  </div>
</template>
<script>
import DxTreeView from 'devextreme-vue/tree-view';
import DxSortable from 'devextreme-vue/sortable';
import service from './data.js';

const treeViewDriveCRef = 'treeViewDriveC';
const treeViewDriveDRef = 'treeViewDriveD';

export default {
  components: {
    DxTreeView, DxSortable
  },
  data() {
    return {
      itemsDriveC: service.getItemsDriveC(),
      itemsDriveD: service.getItemsDriveD(),
      treeViewDriveCRef,
      treeViewDriveDRef
    };
  },
  computed: {
    treeViewDriveC: function() {
      return this.$refs[treeViewDriveCRef].instance;
    },
    treeViewDriveD: function() {
      return this.$refs[treeViewDriveDRef].instance;
    }
  },
  methods: {
    onDragChange(e) {
      if(e.fromComponent === e.toComponent) {
        const fromNode = this.findNode(this.getTreeView(e.fromData), e.fromIndex);
        const toNode = this.findNode(this.getTreeView(e.toData), this.calculateToIndex(e));
        if (toNode !== null && this.isChildNode(fromNode, toNode)) {
          e.cancel = true;
        }
      }
    },

    onDragEnd(e) {
      if(e.fromComponent === e.toComponent && e.fromIndex === e.toIndex) {
        return;
      }

      const fromTreeView = this.getTreeView(e.fromData);
      const toTreeView = this.getTreeView(e.toData);

      const fromNode = this.findNode(fromTreeView, e.fromIndex);
      const toNode = this.findNode(toTreeView, this.calculateToIndex(e));

      if(e.dropInsideItem && toNode !== null && !toNode.itemData.isDirectory) {
        return;
      }

      const fromTopVisibleNode = this.getTopVisibleNode(e.fromComponent);
      const toTopVisibleNode = this.getTopVisibleNode(e.toComponent);

      const fromItems = this.getItems(e.fromData);
      const toItems = this.getItems(e.toData);
      this.moveNode(fromNode, toNode, fromItems, toItems, e.dropInsideItem);

      this.itemsDriveC = [].concat(this.itemsDriveC);
      this.itemsDriveD = [].concat(this.itemsDriveD);

      this.$root.$nextTick(() => {
        fromTreeView.scrollToItem(fromTopVisibleNode);
        toTreeView.scrollToItem(toTopVisibleNode);
      });
    },

    getTreeView(driveName) {
      return driveName === 'driveC'
        ? this.treeViewDriveC
        : this.treeViewDriveD;
    },

    getItems(driveName) {
      return driveName === 'driveC'
        ? this.itemsDriveC
        : this.itemsDriveD;
    },

    calculateToIndex(e) {
      if(e.fromComponent != e.toComponent || e.dropInsideItem) {
        return e.toIndex;
      }

      return e.fromIndex >= e.toIndex
        ? e.toIndex
        : e.toIndex + 1;
    },

    findNode(treeView, index) {
      const nodeElement = treeView.element().querySelectorAll('.dx-treeview-node')[index];
      if(nodeElement) {
        return this.findNodeById(treeView.getNodes(), nodeElement.getAttribute('data-item-id'));
      }
      return null;
    },

    findNodeById(nodes, id) {
      for(var i = 0; i < nodes.length; i++) {
        if(nodes[i].itemData.id == id) {
          return nodes[i];
        }
        if(nodes[i].children) {
          const node = this.findNodeById(nodes[i].children, id);
          if(node != null) {
            return node;
          }
        }
      }
      return null;
    },

    moveNode(fromNode, toNode, fromItems, toItems, isDropInsideItem) {
      const fromNodeContainingArray = this.getNodeContainingArray(fromNode, fromItems);
      const fromIndex = fromNodeContainingArray.findIndex(item => item.id == fromNode.itemData.id);
      fromNodeContainingArray.splice(fromIndex, 1);

      if(isDropInsideItem) {
        toNode.itemData.items.splice(toNode.itemData.items.length, 0, fromNode.itemData);
      } else {
        const toNodeContainingArray = this.getNodeContainingArray(toNode, toItems);
        const toIndex = toNode === null
          ? toNodeContainingArray.length
          : toNodeContainingArray.findIndex(item => item.id == toNode.itemData.id);
        toNodeContainingArray.splice(toIndex, 0, fromNode.itemData);
      }
    },

    getNodeContainingArray(node, rootArray) {
      return node === null || node.parent === null
        ? rootArray
        : node.parent.itemData.items;
    },

    isChildNode(parentNode, childNode) {
      let parent = childNode.parent;
      while(parent !== null) {
        if(parent.itemData.id === parentNode.itemData.id) {
          return true;
        }
        parent = parent.parent;
      }
      return false;
    },

    getTopVisibleNode(component) {
      const treeViewElement = component.element();
      const treeViewTopPosition = treeViewElement.getBoundingClientRect().top;
      const nodes = treeViewElement.querySelectorAll('.dx-treeview-node');
      for(let i = 0; i < nodes.length; i++) {
        const nodeTopPosition = nodes[i].getBoundingClientRect().top;
        if(nodeTopPosition >= treeViewTopPosition) {
          return nodes[i];
        }
      }

      return null;
    }
  }
};
</script>
<style scoped>
.form {
    display: flex;
}

.form>div {
    display: inline-block;
    vertical-align: top;
}

#treeviewDriveC,
#treeviewDriveD {
    margin-top: 10px;
}

.drive-header {
    min-height: auto;
    padding: 0px;
    cursor: default;
}

.drive-header .dx-icon {
    margin-top: -4px;
}

.drive-panel {
    padding: 20px 30px;
    font-size: 115%;
    font-weight: bold;
    border-right: 1px solid rgba(165, 165, 165, 0.4);
    height: 100%;
}

.drive-panel:last-of-type {
    border-right: none;
}
</style>
