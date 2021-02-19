<template>
  <div class="dx-fieldset">
    <div class="dx-field">
      <div class="dx-field-label">DropDownBox with embedded TreeView</div>
      <div class="dx-field-value">
        <DxDropDownBox
          v-model:value="treeBoxValue"
          v-model:opened="isTreeBoxOpened"
          :show-clear-button="true"
          :data-source="treeDataSource"
          value-expr="ID"
          display-expr="name"
          placeholder="Select a value..."
          @value-changed="syncTreeViewSelection($event)"
        >
          <template #content="{ data }">
            <DxTreeView
              :ref="treeViewRefName"
              :data-source="treeDataSource"
              :select-by-click="true"
              data-structure="plain"
              key-expr="ID"
              parent-id-expr="categoryId"
              selection-mode="single"
              display-expr="name"
              @content-ready="$event.component.selectItem(treeBoxValue)"
              @item-selection-changed="treeView_itemSelectionChanged($event)"
              @item-click="onTreeItemClick($event)"
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
          v-model:opened="isGridBoxOpened"
          :defer-rendering="false"
          :display-expr="gridBoxDisplayExpr"
          :show-clear-button="true"
          :data-source="gridDataSource"
          value-expr="ID"
          placeholder="Select a value..."
        >
          <template #content="{ data }">
            <DxDataGrid
              :data-source="gridDataSource"
              :columns="gridColumns"
              :hover-state-enabled="true"
              v-model:selected-row-keys="gridBoxValue"
              @selection-changed="onGridSelectionChanged($event)"
              height="100%"
            >
              <DxSelection mode="single"/>
              <DxPaging
                :enabled="true"
                :page-size="10"
              />
              <DxFilterRow :visible="true"/>
              <DxScrolling mode="virtual"/>
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
      isGridBoxOpened: false,
      isTreeBoxOpened: false,
      gridBoxValue: [3],
      treeViewRefName: 'tree-view',
      gridColumns: ['CompanyName', 'City', 'Phone']
    };
  },
  created() {
    this.treeDataSource = this.makeAsyncDataSource('treeProducts.json');
    this.gridDataSource = this.makeAsyncDataSource('customers.json');
    this.treeBoxValue = '1_1';
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
    syncTreeViewSelection() {
      if (!this.$refs[this.textBoxRefName]) return;
      if (!this.treeBoxValue) {
        this.$refs[this.textBoxRefName].instance.unselectAll();
      } else {
        this.$refs[this.textBoxRefName].instance.selectItem(this.treeBoxValue);
      }
    },
    treeView_itemSelectionChanged(e) {
      this.treeBoxValue = e.component.getSelectedNodeKeys();
    },
    gridBoxDisplayExpr(item) {
      return item && `${item.CompanyName } <${ item.Phone }>`;
    },
    onTreeItemClick() {
      this.isTreeBoxOpened = false;
    },
    onGridSelectionChanged() {
      this.isGridBoxOpened = false;
    }
  }
};
</script>
<style scoped>
.dx-fieldset {
    height: 500px;
}
</style>
