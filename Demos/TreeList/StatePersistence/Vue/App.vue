<template>
  <div>
    <div id="descContainer">
      Sort and filter data, reorder and resize columns, select and expand rows. Once you are done,
      <a @click="onRefreshClick">refresh</a>
      the web page to see that the grid’s state is automatically persisted to continue working from where you stopped
      or you can <a @click="onStateResetClick">reset</a> the grid to its initial state.
    </div>
    <DxTreeList
      id="employees"
      ref="treeList"
      :data-source="employees"
      :allow-column-reordering="true"
      :allow-column-resizing="true"
      :show-borders="true"
      :expanded-row-keys="expandedRowKeys"
      key-expr="ID"
      parent-id-expr="Head_ID"
    >
      <DxSelection
        :recursive="true"
        mode="multiple"
      />
      <DxFilterRow
        :visible="true"
      />
      <DxStateStoring
        :enabled="true"
        type="localStorage"
        storage-key="treeListStorage"
      />
      <DxColumn
        data-field="Full_Name"
      />
      <DxColumn
        data-field="Title"
        caption="Position"
      />
      <DxColumn
        data-field="City"
      />
      <DxColumn
        :width="160"
        data-field="Hire_Date"
        data-type="date"
      />
    </DxTreeList>
  </div>
</template>
<script>
import { employees } from './data.js';
import { DxTreeList, DxSelection, DxFilterRow, DxStateStoring, DxColumn } from 'devextreme-vue/tree-list';

export default {
  components: {
    DxTreeList, DxSelection, DxFilterRow, DxStateStoring, DxColumn
  },
  data() {
    return {
      employees: employees,
      expandedRowKeys: [1, 2, 10]
    };
  },
  methods: {
    onRefreshClick() {
      window.location.reload();
    },
    onStateResetClick() {
      this.$refs['treeList'].instance.state(null);
    }
  }
};
</script>
<style scoped>
#employees {
    height: 440px;
    margin-top: 30px;
}

#descContainer  a {
    color: #f05b41;
    text-decoration: underline;
    cursor: pointer;
}

#descContainer  a:hover {
    text-decoration: none;
}
</style>
