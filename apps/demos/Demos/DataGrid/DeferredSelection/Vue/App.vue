<template>
  <div>
    <DxDataGrid
      id="grid-container"
      :data-source="tasksDataSource"
      :remote-operations="true"
      :show-borders="true"
      :selection-filter="selectionFilter"
      :on-initialized="onInitialized"
    >
      <DxSelection
        :deferred="true"
        mode="multiple"
      />
      <DxPager :visible="true"/>
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
        data-field="Task_Assigned_Employee_ID"
        width="auto"
      >
        <DxLookup
          :data-source="employeesDataSource"
          value-expr="ID"
          display-expr="Name"
        />
      </DxColumn>
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
  DxDataGrid, DxColumn, DxFilterRow, DxSelection, type DxDataGridTypes, DxPager, DxLookup,
} from 'devextreme-vue/data-grid';
import DxButton from 'devextreme-vue/button';
import { query } from 'devextreme-vue/common/data';
import { createStore } from 'devextreme-aspnet-data-nojquery';

const MILLISECONDS_IN_DAY = 1000 * 60 * 60 * 24;

const url = 'https://js.devexpress.com/Demos/NetCore/api/TreeListTasks';
const tasksDataSource = createStore({
  key: 'Task_ID',
  loadUrl: `${url}/Tasks`,
  onBeforeSend(method, ajaxOptions) {
    ajaxOptions.xhrFields = { withCredentials: true };
  },
});
const employeesDataSource = createStore({
  key: 'ID',
  loadUrl: `${url}/TaskEmployees`,
  onBeforeSend(method, ajaxOptions) {
    ajaxOptions.xhrFields = { withCredentials: true };
  },
});

let dataGrid: DxDataGrid['instance'];
const selectionFilter = ['Task_Status', '=', 'Completed'];

const taskCount = ref(0);
const peopleCount = ref(0);
const avgDuration = ref(0);

const calculateStatistics = async () => {
  if (!dataGrid) return;

  const selectedItems = await dataGrid.getSelectedRowsData();

  const totalDuration = selectedItems.reduce((currentValue, item) => {
    const duration = new Date(item.Task_Due_Date).getTime() - new Date(item.Task_Start_Date).getTime();

    return currentValue + duration;
  }, 0);
  const averageDurationInDays = totalDuration / MILLISECONDS_IN_DAY / selectedItems.length;

  taskCount.value = selectedItems.length;
  peopleCount.value = query(selectedItems)
    .groupBy('Task_Assigned_Employee_ID')
    .toArray().length;
  avgDuration.value = Math.round(averageDurationInDays) || 0;
};

const onInitialized = (e: DxDataGridTypes.InitializedEvent) => {
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
