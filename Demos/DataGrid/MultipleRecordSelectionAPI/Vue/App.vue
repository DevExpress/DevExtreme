<template>
  <div>
    <DxDataGrid
      id="grid-container"
      :data-source="employees"
      ref="dataGridRef"
      :selected-row-keys="selectedRowKeys"
      :show-borders="true"
      key-expr="ID"
      @selection-changed="onSelectionChanged"
    >
      <DxSelection mode="multiple"/>
      <DxColumn
        :width="70"
        data-field="Prefix"
        caption="Title"
      />
      <DxColumn
        data-field="FirstName"
      />
      <DxColumn
        data-field="LastName"
      />
      <DxColumn
        :width="180"
        data-field="Position"
      />
      <DxColumn
        :width="125"
        data-field="BirthDate"
        data-type="date"
      />
      <DxColumn
        :width="125"
        data-field="HireDate"
        data-type="date"
      />
      <DxToolbar>
        <DxItem location="before">
          <DxSelectBox
            :data-source="prefixOptions"
            :value="selectedPrefix"
            :input-attr="{ 'aria-label': 'Title' }"
            placeholder="Select title"
            width="150px"
            @value-changed="filterSelection"
          />
        </DxItem>
        <DxItem location="before">
          <DxButton
            :disabled="!selectedRowKeys.length"
            text="Clear Selection"
            @click="clearSelection"
          />
        </DxItem>
      </DxToolbar>
    </DxDataGrid>
    <div class="selected-data">
      <span class="caption">Selected Records:</span>{{ ' ' }}
      <span>
        {{ selectedEmployeeNames }}
      </span>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  DxColumn,
  DxDataGrid,
  DxSelection,
  DxToolbar,
  DxItem,
} from 'devextreme-vue/data-grid';
import DxButton from 'devextreme-vue/button';
import DxSelectBox from 'devextreme-vue/select-box';
import { employees } from './data.js';

const dataGridRef = ref<DxDataGrid | null>(null);

const selectedPrefix = ref<string | null>(null);
const prefixOptions = ['All', 'Dr.', 'Mr.', 'Mrs.', 'Ms.'];

let selectionChangedBySelectBox = false;
const selectedRowsData = ref<any[]>([]);

const getEmployeeName = (row) => `${row.FirstName} ${row.LastName}`;

const selectedRowKeys = computed(() => selectedRowsData.value.map((employee) => employee.ID));
const selectedEmployeeNames = computed(() => (
  selectedRowsData.value.length ? selectedRowsData.value.map(getEmployeeName).join(', ') : 'Nobody has been selected'
));

const clearSelection = () => {
  const dataGrid = dataGridRef.value!.instance!;

  dataGrid.clearSelection();
};

const filterSelection = (e) => {
  if (!e.value) {
    return;
  }

  selectedPrefix.value = e.value;

  selectionChangedBySelectBox = true;

  selectedRowsData.value = e.value === 'All'
    ? employees
    : employees.filter((employee) => employee.Prefix === e.value);
};

const onSelectionChanged = (e) => {
  if (!selectionChangedBySelectBox) {
    selectedPrefix.value = null;
  }

  selectedRowsData.value = e.selectedRowsData;

  selectionChangedBySelectBox = false;
};
</script>
<style scoped>
#grid {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.selected-data {
  margin-top: 20px;
  padding: 20px;
  background-color: rgba(191, 191, 191, 0.15);
}

.selected-data .caption {
  font-weight: bold;
  font-size: 115%;
  margin-right: 4px;
}
</style>
