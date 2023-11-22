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
  DxDataGridTypes,
} from 'devextreme-vue/data-grid';
import DxButton from 'devextreme-vue/button';
import DxSelectBox, { DxSelectBoxTypes } from 'devextreme-vue/select-box';
import { employees, Employee } from './data.ts';

const dataGridRef = ref<DxDataGrid | null>(null);

const selectedPrefix = ref<string | null>(null);
const prefixOptions = ['All', 'Dr.', 'Mr.', 'Mrs.', 'Ms.'];

let selectionChangedBySelectBox = false;
const selectedRowsData = ref<Employee[]>([]);

const getEmployeeName = (row: Employee) => `${row.FirstName} ${row.LastName}`;

const selectedRowKeys = computed(() => selectedRowsData.value.map((employee) => employee.ID));
const selectedEmployeeNames = computed(() => (
  selectedRowsData.value.length ? selectedRowsData.value.map(getEmployeeName).join(', ') : 'Nobody has been selected'
));

const clearSelection = () => {
  const dataGrid = dataGridRef.value!.instance!;

  dataGrid.clearSelection();
};

const filterSelection = ({ value }: DxSelectBoxTypes.ValueChangedEvent) => {
  if (!value) {
    return;
  }

  selectedPrefix.value = value;

  selectionChangedBySelectBox = true;

  selectedRowsData.value = value === 'All'
    ? employees
    : employees.filter((employee) => employee.Prefix === value);
};

const onSelectionChanged = (e: DxDataGridTypes.SelectionChangedEvent<Employee>) => {
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
