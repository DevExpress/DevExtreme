<template>
  <DxScheduler
    time-zone="America/Los_Angeles"
    :data-source="schedulerDataSource"
    :views="views"
    current-view="workWeek"
    :current-date="currentDate"
    :start-day-hour="9"
    :end-day-hour="19"
    :height="600"
    ref="schedulerRef"
  >
    <DxResource
      :data-source="assignees"
      field-expr="assigneeId"
      label="Assignee"
      :allow-multiple="true"
      icon="user"
    />
    <DxToolbar>
      <DxItem name="today"/>
      <DxItem name="dateNavigator"/>
      <DxItem
        location="before"
        locate-in-menu="auto"
        widget="dxButton"
        :options="newEventButtonOptions"
      />
      <DxItem
        location="before"
        locate-in-menu="auto"
        template="assigneesTemplate"
      />
      <DxItem
        location="after"
        locate-in-menu="auto"
        name="viewSwitcher"
      />
    </DxToolbar>
    <template #assigneesTemplate>
      <DxSelectBox
        placeholder="Select Employee"
        :items="assignees"
        :show-clear-button="true"
        display-expr="text"
        value-expr="id"
        :input-attr="{ 'aria-label': 'Select Employee' }"
        :width="200"
        :value="assigneesFilterValue"
        @value-changed="onAssigneesFilterChange"
      />
    </template>
  </DxScheduler>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import {
  DxScheduler, DxResource,
  DxToolbar, DxItem, type DxSchedulerTypes,
} from 'devextreme-vue/scheduler';
import { DxSelectBox, type DxSelectBoxTypes } from 'devextreme-vue/select-box';
import { type DataSource } from 'devextreme-vue/common/data';
import { assignees, currentDate, schedulerDataSource } from './data.ts';

const MS_IN_HOUR = 60 * 1000;
const views: DxSchedulerTypes.ViewType[] = ['day', 'week', 'workWeek', 'month'];
const assigneesFilterValue = ref(undefined);
const schedulerRef = ref<DxScheduler | null>(null);

const onAppointmentAdd = () => {
  const scheduler = schedulerRef.value?.instance;
  if (!scheduler) {
    return;
  }

  const selected = scheduler.option('selectedCellData') ?? [];

  if (selected.length) {
    const firstSelected = selected[0];
    const lastSelected = selected.at(-1);

    scheduler.showAppointmentPopup({
      ...firstSelected.groups,
      allDay: firstSelected.allDay,
      startDate: new Date(firstSelected.startDateUTC),
      endDate: new Date(lastSelected.endDateUTC),
    }, true);

    return;
  }

  const currentDate = scheduler.option('currentDate');
  const cellDuration = scheduler.option('cellDuration') as number;
  const cellDurationMs = cellDuration * MS_IN_HOUR;
  const currentTime = new Date(currentDate as Date).getTime();
  const roundTime = Math.round(currentTime / cellDurationMs) * cellDurationMs;

  scheduler.showAppointmentPopup({
    startDate: new Date(roundTime),
    endDate: new Date(roundTime + cellDurationMs),
  }, true);
};

const newEventButtonOptions = {
  icon: 'plus',
  text: 'New Appointment',
  stylingMode: 'outlined',
  type: 'normal',
  onClick: () => { onAppointmentAdd(); },
};

function onAssigneesFilterChange(event: DxSelectBoxTypes.ValueChangedEvent) {
  const scheduler = schedulerRef.value?.instance;
  if (!scheduler) {
    return;
  }

  const dataSource = scheduler.option('dataSource') as DataSource;
  const filter = event.value ? ['assigneeId', 'contains', event.value] : null;

  dataSource.filter(filter);
  scheduler.option('dataSource', dataSource);
  assigneesFilterValue.value = event.value;
}
</script>
