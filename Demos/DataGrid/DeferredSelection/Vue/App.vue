<template>
  <div>
    <DxDataGrid
      id="grid-container"
      :data-source="dataSource"
      :show-borders="true"
      :selection-filter="selectionFilter"
      :on-initialized="onInitialized"
    >
      <DxSelection
        :deferred="true"
        mode="multiple"
      />
      <DxFilterRow :visible="true"/>
      <DxColumn
        caption="Subject"
        data-field="Task_Subject"
      />
      <DxColumn
        caption="Start Date"
        data-field="Task_Start_Date"
        width="auto"
        data-type="date"
      />
      <DxColumn
        caption="Due Date"
        data-field="Task_Due_Date"
        width="auto"
        data-type="date"
      />
      <DxColumn
        :allow-sorting="false"
        caption="Assigned To"
        data-field="ResponsibleEmployee.Employee_Full_Name"
        width="auto"
      />
      <DxColumn
        caption="Status"
        width="auto"
        data-field="Task_Status"
      />
    </DxDataGrid>
    <div class="selection-summary center">
      <DxButton
        id="calculateButton"
        :on-click="calculateStatistics"
        text="Get statistics on the selected tasks"
        type="default"
      />
      <div>
        <div class="column">
          <span class="text count">Task count: </span>
          <span class="value">{{ taskCount }}</span>
        </div>
        <div class="column">
          <span class="text people-count">People assigned: </span>
          <span class="value">{{ peopleCount }}</span>
        </div>
        <div class="column">
          <span class="text avg-duration">Average task duration (days): </span>
          <span class="value">{{ avgDuration }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import {
  DxDataGrid, DxColumn, DxFilterRow, DxSelection,
} from 'devextreme-vue/data-grid';
import DxButton from 'devextreme-vue/button';

import DataGrid, { InitializedEvent } from 'devextreme/ui/data_grid';
import { Options as DataSourceOptions } from 'devextreme/data/data_source';

import query from 'devextreme/data/query';
import 'devextreme/data/odata/store';

const MILLISECONDS_IN_DAY = 1000 * 60 * 60 * 24;

const dataSource: DataSourceOptions = {
  store: {
    type: 'odata',
    url: 'https://js.devexpress.com/Demos/DevAV/odata/Tasks',
    key: 'Task_ID',
  },
  expand: 'ResponsibleEmployee',
  select: [
    'Task_ID',
    'Task_Subject',
    'Task_Start_Date',
    'Task_Due_Date',
    'Task_Status',
    'ResponsibleEmployee/Employee_Full_Name',
  ],
};

let dataGrid: DataGrid;
const selectionFilter = ['Task_Status', '=', 'Completed'];

const taskCount = ref(0);
const peopleCount = ref(0);
const avgDuration = ref(0);

const calculateStatistics = async() => {
  const selectedItems = await dataGrid.getSelectedRowsData();

  const totalDuration = selectedItems.reduce((currentValue, item) => {
    const duration = item.Task_Due_Date - item.Task_Start_Date;

    return currentValue + duration;
  }, 0);
  const averageDurationInDays = totalDuration / MILLISECONDS_IN_DAY / selectedItems.length;

  taskCount.value = selectedItems.length;
  peopleCount.value = query(selectedItems)
    .groupBy('ResponsibleEmployee.Employee_Full_Name')
    .toArray().length;
  avgDuration.value = Math.round(averageDurationInDays) || 0;
};

const onInitialized = (e: InitializedEvent) => {
  dataGrid = e.component!;

  calculateStatistics();
};
</script>

<style>
#grid-container {
  height: 400px;
}

.center {
  text-align: center;
}

.selection-summary {
  border: 1px solid rgba(161, 161, 161, 0.2);
  padding: 25px;
}

.column {
  margin: 20px 30px 0 0;
  display: inline-block;
  white-space: nowrap;
  text-align: right;
}

.column:nth-child(2) {
  padding: 0 4px;
}

.value {
  font-size: 40px;
  display: inline-block;
  vertical-align: middle;
}

.text {
  text-align: left;
  white-space: normal;
  display: inline-block;
  vertical-align: middle;
  margin-right: 4px;
}

.avg-duration {
  width: 100px;
}

.count {
  width: 40px;
}

.people-count {
  width: 65px;
}
</style>
