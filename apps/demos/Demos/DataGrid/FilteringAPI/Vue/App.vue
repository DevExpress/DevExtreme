<template>
  <div>
    <div class="left-side">
      <div class="logo">
        <img
          :src="'../../../../images/logo-devav.png'"
          alt="DEVAV"
        >
        <img
          :src="'../../../../images/logo-tasks.png'"
          alt="Tasks"
        >
      </div>
    </div>
    <div class="right-side">
      <DxSelectBox
        :items="statuses"
        :value="statuses[0]"
        :input-attr="{ 'aria-label': 'Status' }"
        @value-changed="onValueChanged"
      />
    </div>

    <DxDataGrid
      id="gridContainer"
      ref="dataGridRef"
      :data-source="tasks"
      key-expr="Task_ID"
      :column-auto-width="true"
      :show-borders="true"
    >
      <DxPager :visible="true"/>
      <DxColumn
        :width="80"
        data-field="Task_ID"
      />
      <DxColumn
        data-field="Task_Start_Date"
        data-type="date"
        caption="Start Date"
      />
      <DxColumn
        :allow-sorting="false"
        data-field="Employee_Full_Name"
        css-class="employee"
        caption="Assigned To"
      />
      <DxColumn
        :width="350"
        data-field="Task_Subject"
        caption="Subject"
      />
      <DxColumn
        data-field="Task_Status"
        caption="Status"
      />
    </DxDataGrid>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import {
  DxColumn,
  DxDataGrid,
  DxPager,
} from 'devextreme-vue/data-grid';
import DxSelectBox, { type DxSelectBoxTypes } from 'devextreme-vue/select-box';
import { tasks, statuses } from './data.ts';

const dataGridRef = ref<DxDataGrid | null>(null);

const onValueChanged = ({ value }: DxSelectBoxTypes.ValueChangedEvent) => {
  const dataGrid = dataGridRef.value!.instance!;

  if (value === 'All') {
    dataGrid.clearFilter();
  } else {
    dataGrid.filter(['Task_Status', '=', value]);
  }
};
</script>
<style scoped>
.right-side {
  position: absolute;
  right: 1px;
  top: 6px;
}

.logo {
  line-height: 48px;
}

.logo img {
  vertical-align: middle;
  margin: 0 5px;
}

.logo img:first-child {
  margin-right: 9px;
}

.dx-row.dx-data-row .employee {
  color: var(--dx-color-primary);
  font-weight: bold;
}

#gridContainer {
  margin: 20px 0;
  height: 400px;
}
</style>
