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
<script setup lang="ts">
import { DxScheduler, DxResource } from 'devextreme-vue/scheduler';
import { employees, data } from './data.ts';
import DataCell from './DataCell.vue';
import ResourceCell from './ResourceCell.vue';

const groups = ['employeeID'];
const views = ['month'];
const currentDate = new Date(2021, 5, 2, 11, 30);
const dataSource = data;
</script>
<style>
.dx-scheduler-group-header,
.dx-scheduler-date-table-cell {
  position: relative;
}

.dx-scheduler-date-table-other-month.dx-scheduler-date-table-cell {
  opacity: 1;
  color: rgba(0, 0, 0, 0.3) !important;
}

.dx-color-scheme-light .dx-scheduler-work-space-month .dx-scheduler-date-table-cell,
.dx-color-scheme-carmine .dx-scheduler-work-space-month .dx-scheduler-date-table-cell,
.dx-color-scheme-softblue .dx-scheduler-work-space-month .dx-scheduler-date-table-cell,
.dx-color-scheme-blue-light .dx-scheduler-work-space-month .dx-scheduler-date-table-cell,
.dx-color-scheme-saas-light .dx-scheduler-work-space-month .dx-scheduler-date-table-cell,
.dx-color-scheme-lime-light .dx-scheduler-work-space-month .dx-scheduler-date-table-cell,
.dx-color-scheme-orange-light .dx-scheduler-work-space-month .dx-scheduler-date-table-cell,
.dx-color-scheme-purple-light .dx-scheduler-work-space-month .dx-scheduler-date-table-cell,
.dx-color-scheme-teal-light .dx-scheduler-work-space-month .dx-scheduler-date-table-cell {
  color: rgba(0, 0, 0, .6);
}

.dx-color-scheme-dark .dx-scheduler-work-space-month .dx-scheduler-date-table-cell,
.dx-color-scheme-darkviolet .dx-scheduler-work-space-month .dx-scheduler-date-table-cell,
.dx-color-scheme-darkmoon .dx-scheduler-work-space-month .dx-scheduler-date-table-cell,
.dx-color-scheme-blue-dark .dx-scheduler-work-space-month .dx-scheduler-date-table-cell,
.dx-color-scheme-saas-dark .dx-scheduler-work-space-month .dx-scheduler-date-table-cell,
.dx-color-scheme-lime-dark .dx-scheduler-work-space-month .dx-scheduler-date-table-cell,
.dx-color-scheme-orange-dark .dx-scheduler-work-space-month .dx-scheduler-date-table-cell,
.dx-color-scheme-purple-dark .dx-scheduler-work-space-month .dx-scheduler-date-table-cell,
.dx-color-scheme-teal-dark .dx-scheduler-work-space-month .dx-scheduler-date-table-cell {
  color: rgba(255, 255, 255, 1);
}

.dx-scheduler-date-table-cell .dx-template-wrapper {
  position: absolute;
  width: 100%;
  height: 100%;
  padding-right: 6px;
}

</style>
