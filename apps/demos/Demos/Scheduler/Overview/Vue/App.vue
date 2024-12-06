<template>
  <DxScheduler
    time-zone="America/Los_Angeles"
    :data-source="dataSource"
    :current-date="currentDate"
    :views="views"
    :groups="groups"
    :height="710"
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

.dx-scheduler-group-header-content {
  padding-left: 8px;
}

.dx-color-scheme-light,
.dx-color-scheme-carmine,
.dx-color-scheme-softblue,
.dx-color-scheme-blue-light,
.dx-color-scheme-saas-light,
.dx-color-scheme-lime-light,
.dx-color-scheme-orange-light,
.dx-color-scheme-purple-light,
.dx-color-scheme-teal-light {
  --text-color-1: rgba(0, 0, 0, .6);
  --text-color-2: rgba(255, 255, 255, 1);
  --disabled-color: rgba(0, 0, 0, 0.38);
  --background-color-1: rgba(50, 134, 56, 1);
  --background-color-2: rgba(194, 81, 0, 1);
}

.dx-color-scheme-dark,
.dx-color-scheme-darkviolet,
.dx-color-scheme-darkmoon,
.dx-color-scheme-blue-dark,
.dx-color-scheme-saas-dark,
.dx-color-scheme-lime-dark,
.dx-color-scheme-orange-dark,
.dx-color-scheme-purple-dark,
.dx-color-scheme-teal-dark {
  --text-color-1: rgba(255, 255, 255, 1);
  --text-color-2: rgba(54, 54, 64, 1);
  --disabled-color: rgba(255, 255, 255, 0.38);
  --background-color-1: rgba(159, 213, 161, 1);
  --background-color-2: rgba(255, 181, 127, 1);

}

.dx-scheduler-header .dx-toolbar .dx-button,
.dx-scheduler-header .dx-toolbar .dx-button .dx-icon {
  color: var(--text-color-1);
}

.dx-scheduler-date-table-other-month.dx-scheduler-date-table-cell {
  opacity: 1;
  color: var(--disabled-color) !important;
}

.dx-scheduler-work-space-month .dx-scheduler-date-table-cell {
  color: var(--text-color-1);
}

.dx-scheduler-work-space-month .dx-scheduler-appointment,
.dx-scheduler-work-space-month .dx-scheduler-appointment.dx-state-focused {
  color: var(--text-color-2);
  line-height: 22px;
}

.dx-scheduler-work-space-month .dx-scheduler-appointment .dx-scheduler-appointment-content {
  padding-top: 0;
}

.dx-scheduler-date-table-cell .dx-template-wrapper {
  position: absolute;
  height: 100%;
  width: 100%;
  padding-right: 6px;
}

.dx-scheduler-appointment {
  color: rgba(255, 255, 255, 1);
}

</style>
