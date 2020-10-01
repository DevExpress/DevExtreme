<template>
  <div class="dx-fieldset">
    <div class="dx-field">
      <div class="dx-field-label">DropDownBox with embedded TreeView</div>
      <div class="dx-field-value">
        <DxDropDownBox
          v-model:value="treeBoxValue"
          :show-clear-button="true"
          :data-source="treeDataSource"
          value-expr="ID"
          display-expr="name"
          placeholder="Select a value..."
          @value-changed="syncTreeViewSelection($event)"
        >
          <template #content="{ data }">
            <DxTreeView
              :ref="treeViewName"
              :data-source="treeDataSource"
              :select-by-click="true"
              :select-nodes-recursive="false"
              data-structure="plain"
              key-expr="ID"
              parent-id-expr="categoryId"
              selection-mode="multiple"
              show-check-boxes-mode="normal"
              display-expr="name"
              @content-ready="syncTreeViewSelection($event)"
              @item-selection-changed="treeView_itemSelectionChanged($event)"
            />
          </template>
        </DxDropDownBox>
      </div>
    </div>
    <div class="dx-field">
      <div class="dx-field-label">DropDownBox with embedded DataGrid</div>
      <div class="dx-field-value">
        <DxDropDownBox
          v-model:value="gridBoxValue"
          :defer-rendering="false"
          :show-clear-button="true"
          :data-source="gridDataSource"
          display-expr="CompanyName"
          value-expr="ID"
          placeholder="Select a value..."
        >
          <template #content="{ data }">
            <DxDataGrid
              :data-source="gridDataSource"
              :columns="gridColumns"
              :hover-state-enabled="true"
              v-model:selected-row-keys="gridBoxValue"
            >
              <DxSelection mode="multiple"/>
              <DxPaging
                :enabled="true"
                :page-size="10"
              />
              <DxFilterRow :visible="true"/>
              <DxScrolling mode="infinite"/>
            </DxDataGrid>
          </template>
        </DxDropDownBox>
      </div>
    </div>
  </div>
</template>
<script>
import DxDropDownBox from 'devextreme-vue/drop-down-box';
import DxTreeView from 'devextreme-vue/tree-view';
import { DxDataGrid, DxSelection, DxPaging, DxFilterRow, DxScrolling } from 'devextreme-vue/data-grid';
import CustomStore from 'devextreme/data/custom_store';
import 'whatwg-fetch';

export default {
  components: {
    DxDropDownBox,
    DxTreeView,
    DxDataGrid,
    DxSelection,
    DxPaging,
    DxFilterRow,
    DxScrolling
  },
  data() {
    return {
      treeDataSource: null,
      treeBoxValue: null,
      gridDataSource: null,
      gridBoxValue: [3],
      treeViewName: 'tree-view',
      gridColumns: ['CompanyName', 'City', 'Phone']
    };
  },
  created() {
    this.treeDataSource = this.makeAsyncDataSource('treeProducts.json');
    this.gridDataSource = this.makeAsyncDataSource('customers.json');
    this.treeBoxValue = ['1_1'];
  },
  methods: {
    makeAsyncDataSource(jsonFile) {
      return new CustomStore({
        loadMode: 'raw',
        key: 'ID',
        load: function() {
          return fetch(`../../../../data/${ jsonFile}`)
            .then(response => response.json());
        }
      });
    },
    syncTreeViewSelection(e) {
      let treeView = (e.component.selectItem && e.component) || (this.$refs[this.treeViewName] && this.$refs[this.treeViewName].instance);

      if (treeView) {
        if (e.value === null) {
          treeView.unselectAll();
        } else {
          let values = e.value || this.treeBoxValue;
          values && values.forEach(function(value) {
            treeView.selectItem(value);
          });
        }
      }
    },
    treeView_itemSelectionChanged(e) {
      this.treeBoxValue = e.component.getSelectedNodeKeys();
    }
  }
};
</script>
<style scoped>
.dx-fieldset {
    height: 500px;
}
</style>
