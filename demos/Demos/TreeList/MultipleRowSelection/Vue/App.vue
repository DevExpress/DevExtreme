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
          :input-attr="{ 'aria-label': 'Selection Mode' }"
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
<script setup lang="ts">
import { ref } from 'vue';
import { DxTreeList, DxSelection, DxColumn } from 'devextreme-vue/tree-list';
import { DxCheckBox } from 'devextreme-vue/check-box';
import { DxSelectBox } from 'devextreme-vue/select-box';
import { employees } from './data.ts';

const emptySelectedText = 'Nobody has been selected';
const expandedRowKeys = [1, 2, 10];
const selectedRowKeys = ref([]);
const recursive = ref(false);
const selectedEmployeeNames = ref(emptySelectedText);
const selectionMode = ref('all');

function onOptionsChanged() {
  selectedRowKeys.value = [];
  selectedEmployeeNames.value = emptySelectedText;
}
function onSelectionChanged({ component }) {
  const selectedData = component.getSelectedRowsData(selectionMode.value);
  selectedEmployeeNames.value = getEmployeeNames(selectedData);
}
function getEmployeeNames(employeeList) {
  if (employeeList.length > 0) {
    return employeeList.map((employee) => employee.Full_Name).join(', ');
  }
  return emptySelectedText;
}
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
