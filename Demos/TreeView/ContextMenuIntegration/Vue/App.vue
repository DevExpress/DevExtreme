<template>
  <div class="form">
    <DxTreeView
      id="treeview"
      :ref="treeViewRef"
      :items="products"
      :width="300"
      :height="450"
      @item-context-menu="treeViewItemContextMenu"
    />
    <div class="log-container">
      <div><i class="icon dx-icon-clock"/>&nbsp;Operations log:</div>
      <DxList
        id="log"
        show-scrollbar="always"
        :width="400"
        :height="300"
        :items="logItems"
      />
    </div>
    <DxContextMenu
      :ref="contextMenuRef"
      v-model:data-source="menuItems"
      target="#treeview .dx-treeview-item"
      @item-click="contextMenuItemClick"
    />
  </div>
</template>
<script>
import DxTreeView from 'devextreme-vue/tree-view';
import DxList from 'devextreme-vue/list';
import DxContextMenu from 'devextreme-vue/context-menu';
import service from './data.js';

const treeViewRef = 'treeView';
const contextMenuRef = 'contextMenu';

export default {
  components: {
    DxTreeView, DxList, DxContextMenu
  },
  data() {
    return {
      products: service.getProducts(),
      menuItems: service.getMenuItems(),
      logItems: [],
      selectedTreeItem: undefined,
      treeViewRef,
      contextMenuRef
    };
  },
  computed: {
    treeView: function() {
      return this.$refs[treeViewRef].instance;
    },
    contextMenu: function() {
      return this.$refs[contextMenuRef].instance;
    }
  },
  methods: {
    treeViewItemContextMenu(e) {
      this.selectedTreeItem = e.itemData;

      const isProduct = e.itemData.price !== undefined;
      this.contextMenu.option('items[0].visible', !isProduct);
      this.contextMenu.option('items[1].visible', !isProduct);
      this.contextMenu.option('items[2].visible', isProduct);
      this.contextMenu.option('items[3].visible', isProduct);

      this.contextMenu.option('items[0].disabled', e.node.expanded);
      this.contextMenu.option('items[1].disabled', !e.node.expanded);
    },
    contextMenuItemClick(e) {
      let logEntry = '';
      switch(e.itemData.id) {
        case 'expand': {
          logEntry = `The '${this.selectedTreeItem.text}' group was expanded`;
          this.treeView.expandItem(this.selectedTreeItem.id);
          break;
        }
        case 'collapse': {
          logEntry = `The '${this.selectedTreeItem.text}' group was collapsed`;
          this.treeView.collapseItem(this.selectedTreeItem.id);
          break;
        }
        case 'details': {
          logEntry = `Details about '${this.selectedTreeItem.text}' were displayed`;
          break;
        }
        case 'copy': {
          logEntry = `Information about '${this.selectedTreeItem.text}' was copied`;
          break;
        }
      }
      this.logItems = [...this.logItems, logEntry];
    }
  }
};
</script>
<style scoped>
.form {
  display: flex;
}

.form>div,
#treeview {
    display: inline-block;
    vertical-align: top;
}

.log-container {
    padding: 20px;
    margin-left: 20px;
    background-color: rgba(191, 191, 191, 0.15);
    font-size: 115%;
    font-weight: bold;
    position: relative;
    height: 100%;
}

.log-container .dx-icon-clock {
    position: relative;
    top: 1px;
}

#log {
    margin-top: 10px;
}

#log .dx-empty-message {
    padding-left: 0px;
}

.dx-list-item-content {
    padding-left: 0;
}
</style>
