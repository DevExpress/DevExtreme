<template>
  <DxScheduler
    time-zone="America/Los_Angeles"
    :data-source="dataSource"
    :groups="groups"
    :current-date="currentDate"
    :start-day-hour="9"
    :end-day-hour="16"
    :show-current-time-indicator="false"
    all-day-panel-mode="allDay"
    current-view="workWeek"
    @selection-end="onSelectionEnd"
  >
    <DxView
      :cell-duration="30"
      type="workWeek"
      group-orientation="horizontal"
    />
    <DxResource
      :allow-multiple="false"
      :data-source="priorityData"
      field-expr="priorityId"
      label="Priority"
    />
  </DxScheduler>
</template>
<script setup lang="ts">
import { DxScheduler, DxResource, DxView } from 'devextreme-vue/scheduler';
import { data, priorityData } from './data.ts';

const groups = ['priorityId'];
const currentDate = new Date(2021, 3, 21);
const dataSource = data;

function onSelectionEnd(e: any) {
  const cells = e.selectedCellData;
  if (cells.length <= 1) {
    return;
  }

  const startDate = cells[0].startDateUTC || cells[0].startDate;
  const endDate = cells[cells.length - 1].endDateUTC || cells[cells.length - 1].endDate;

  e.component.showAppointmentPopup({
    startDate,
    endDate,
    ...cells[0].groups,
  }, true);
}
</script>
