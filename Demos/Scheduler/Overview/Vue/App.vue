<template>
  <DxScheduler
    time-zone="America/Los_Angeles"
    :data-source="dataSource"
    :current-date="currentDate"
    :views="views"
    :groups="groups"
    :height="600"
    :show-all-day-panel="true"
    :first-day-of-week="1"
    :start-day-hour="8"
    :end-day-hour="18"
    current-view="month"
    data-cell-template="dataCellTemplate"
    resource-cell-template="resourceCellTemplate"
  >
    <DxResource
      :data-source="employees"
      :allow-multiple="false"
      label="Employee"
      field-expr="employeeID"
    />

    <template #resourceCellTemplate="{ data: employee }">
      <ResourceCell
        :employee="employee"
      />
    </template>

    <template #dataCellTemplate="{ data: cellData }">
      <DataCell
        :cell-data="cellData"
      />
    </template>
  </DxScheduler>
</template>
<script>

import { DxScheduler, DxResource } from 'devextreme-vue/scheduler';

import { employees, data } from './data.js';

import DataCell from './DataCell.vue';
import ResourceCell from './ResourceCell.vue';

export default {
  components: {
    DxScheduler,
    DxResource,
    DataCell,
    ResourceCell
  },
  data() {
    return {
      groups: ['employeeID'],
      views: ['month'],
      currentDate: new Date(2021, 7, 2, 11, 30),
      employees,
      dataSource: data
    };
  }
};
</script>
<style>
.dx-scheduler-date-table-other-month.dx-scheduler-date-table-cell {
    opacity: 1;
    color: rgba(0, 0, 0, 0.3);
}

.dx-scheduler-date-table-cell .dx-template-wrapper {
    position: absolute;
    width: 100%;
    height: 100%;
    padding-right: 6px;
}

</style>
