<template>
  <div>
    <DxLoadPanel
      :position="loadPanelPosition"
      :visible="isLoading"
    />
    <DxDataGrid
      id="gridContainer"
      key-expr="OrderID"
      :data-source="orders"
      :show-borders="true"
      :repaint-changes-only="true"
      @saving="onSaving"
    >
      <DxEditing
        mode="row"
        :allow-adding="true"
        :allow-deleting="true"
        :allow-updating="true"
        v-model:changes="changes"
        v-model:edit-row-key="editRowKey"
      />
      <DxColumn data-field="OrderID" :allow-editing="false"></DxColumn>
      <DxColumn data-field="ShipName"></DxColumn>
      <DxColumn data-field="ShipCountry"></DxColumn>
      <DxColumn data-field="ShipCity"></DxColumn>
      <DxColumn data-field="ShipAddress"></DxColumn>
      <DxColumn data-field="OrderDate" data-type="date"></DxColumn>
      <DxColumn data-field="Freight"></DxColumn>
    </DxDataGrid>
    <div class="options">
        <div class="caption">Options</div>
        <div class="option">
          <span>Edit Row Key:</span>
          <div id="editRowKey">{{ editRowKey === null ? "null" : editRowKey.toString() }}</div>
        </div>
        <div class="option">
          <span>Changes:</span>
          <div id="changes">{{ changesText }}</div>
        </div>
      </div>
  </div>
</template>
<script>
import { DxDataGrid, DxColumn, DxEditing } from 'devextreme-vue/data-grid';
import { DxLoadPanel } from 'devextreme-vue/load-panel';
import { mapGetters, mapActions, mapState } from 'vuex';

export default {
  components: {
    DxDataGrid,
    DxColumn,
    DxEditing,
    DxLoadPanel
  },
  created() {
    this.loadOrders();
  },
  data() {
    return {
      loadPanelPosition: { of: '#gridContainer' }
    }
  },
  computed: {
    ...mapGetters(['orders', 'isLoading']),
    editRowKey: {
      get() {
        return this.$store.state.editRowKey;
      },
      set(value) {
        this.setEditRowKey(value);
      }
    },
    changes: {
      get() {
        return this.$store.state.changes;
      },
      set(value) {
        this.setChanges(value);
      }
    },
    changesText: {
      get() {
         return JSON.stringify(this.changes.map((change) => ({
          type: change.type,
          key: change.type !== 'insert' ? change.key : undefined,
          data: change.data
        })), null, ' ');
      }
    }
  },
  methods: {
    ...mapActions(['setEditRowKey', 'setChanges', 'loadOrders', 'insert', 'update', 'remove', 'saveChange']),
    onSaving(e) {
      e.cancel = true;
      e.promise = this.saveChange(e.changes[0]);
    }
  }
};
</script>
<style scoped>
#gridContainer {
    height: 440px;
}

.options {
    padding: 20px;
    margin-top: 20px;
    background-color: rgba(191, 191, 191, 0.15);
}

.caption {
    margin-bottom: 10px;
	font-weight: 500;
	font-size: 18px;
}

.option {
    margin-bottom: 10px;
}

.option > span {
    position: relative;
    top: 2px;
    margin-right: 10px;
}

.option > div {
    display: inline-block;
    font-weight: bold;
}
</style>

