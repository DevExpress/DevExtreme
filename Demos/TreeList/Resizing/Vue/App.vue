<template>
  <div>
    <DxTreeList
      id="employees"
      :data-source="employees"
      :allow-column-resizing="true"
      :column-resizing-mode="columnResizingMode"
      :column-min-width="50"
      :column-auto-width="true"
      :show-row-lines="true"
      :show-borders="true"
      :expanded-row-keys="expandedRowKeys"
      key-expr="ID"
      parent-id-expr="Head_ID"
    >
      <DxColumn
        data-field="Title"
        caption="Position"
      />
      <DxColumn
        data-field="Full_Name"
      />
      <DxColumn
        data-field="City"
      />
      <DxColumn
        data-field="State"
      />
      <DxColumn
        data-field="Hire_Date"
        data-type="date"
      />
    </DxTreeList>
    <div class="options">
      <div class="caption">Options</div>
      <div class="option">
        <span>Column resizing mode:</span>
        <DxSelectBox
          :items="resizingModes"
          :width="250"
          v-model:value="columnResizingMode"
        />
      </div>
    </div>
  </div>
</template>
<script>
import { employees } from './data.js';
import { DxTreeList, DxColumn } from 'devextreme-vue/tree-list';
import { DxSelectBox } from 'devextreme-vue/select-box';

export default {
  components: {
    DxTreeList, DxColumn,
    DxSelectBox
  },
  data() {
    return {
      employees: employees,
      resizingModes: ['nextColumn', 'widget'],
      columnResizingMode: 'nextColumn',
      expandedRowKeys: [1, 3, 6]
    };
  }
};
</script>
<style scoped>
#employees {
    max-height: 307px;
}

.options {
    padding: 20px;
    margin-top: 20px;
    background-color: rgba(191, 191, 191, 0.15);
    position: absolute;
    bottom: 0px;
    width: 100%;
}

.caption {
	font-weight: 500;
	font-size: 18px;
}

.option {
    margin-top: 10px;
}

.option > span {
    position: relative;
    top: 2px;
    margin-right: 10px;
}

.option > .dx-widget {
    display: inline-block;
    vertical-align: middle;
}
</style>
