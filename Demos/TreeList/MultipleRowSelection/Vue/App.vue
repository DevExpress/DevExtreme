<template>
  <div>
    <DxTreeList
      id="employees"
      ref="treeList"
      :data-source="employees"
      :show-row-lines="true"
      :show-borders="true"
      :column-auto-width="true"
      :expanded-row-keys="expandedRowKeys"
      v-model:selected-row-keys="selectedRowKeys"
      key-expr="ID"
      parent-id-expr="Head_ID"
      @selection-changed="onSelectionChanged"
    >
      <DxSelection
        :recursive="recursive"
        mode="multiple"
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
        data-field="State"
      />
      <DxColumn
        :width="120"
        data-field="Hire_Date"
        data-type="date"
      />
    </DxTreeList>
    <div class="options">
      <div class="caption">Options</div>
      <div class="option">
        <span>Selection Mode</span>{{ ' ' }}
        <DxSelectBox
          v-model:value="selectionMode"
          :items="['all', 'excludeRecursive', 'leavesOnly']"
          @value-changed="onOptionsChanged"
        />
      </div>
      <div class="option">
        <DxCheckBox
          v-model:value="recursive"
          text="Recursive Selection"
          @value-changed="onOptionsChanged"
        />
      </div>
      <div class="selected-data">
        <span class="caption">Selected Records:</span>
        <span id="selected-items-container">{{ selectedEmployeeNames }}</span>
      </div>
    </div>
  </div>
</template>
<script>
import { employees } from './data.js';
import { DxTreeList, DxSelection, DxColumn } from 'devextreme-vue/tree-list';
import { DxCheckBox } from 'devextreme-vue/check-box';
import { DxSelectBox } from 'devextreme-vue/select-box';

const emptySelectedText = 'Nobody has been selected';

export default {
  components: {
    DxTreeList, DxSelection, DxColumn,
    DxCheckBox, DxSelectBox
  },
  data() {
    return {
      employees: employees,
      expandedRowKeys: [1, 2, 10],
      selectedRowKeys: [],
      recursive: false,
      selectedEmployeeNames: emptySelectedText,
      selectionMode: 'all'
    };
  },
  methods: {
    onOptionsChanged() {
      this.selectedRowKeys = [];
      this.selectedEmployeeNames = emptySelectedText;
    },
    onSelectionChanged({ component }) {
      const selectedData = component.getSelectedRowsData(this.selectionMode);
      this.selectedEmployeeNames = this.getEmployeeNames(selectedData);
    },
    getEmployeeNames(employees) {
      if (employees.length > 0) {
        return employees.map(employee => employee.Full_Name).join(', ');
      } else {
        return emptySelectedText;
      }
    }
  }
};
</script>
<style scoped>
#employees {
    max-height: 440px;
}

.options {
    padding: 20px;
    margin-top: 20px;
    background-color: rgba(191, 191, 191, 0.15);
}

.caption {
    font-size: 18px;
    font-weight: 500;
}

.option {
    margin-top: 10px;
}

.selected-data {
    margin-top: 20px;
}

.selected-data .caption {
    margin-right: 4px;
}

.option > span {
    width: 120px;
    display: inline-block;
}

.option > .dx-widget {
    display: inline-block;
    vertical-align: middle;
    width: 100%;
    max-width: 350px;
}
</style>
