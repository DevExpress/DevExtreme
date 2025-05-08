<template>
  <DxScheduler
    time-zone="America/Los_Angeles"
    :data-source="dataSource"
    :current-date="currentDate"
    :views="views"
    :height="600"
    :start-day-hour="9"
    :first-day-of-week="1"
    current-view="workWeek"
    ref="schedulerRef"
  >
    <DxResource
      :data-source="assignees"
      field-expr="assigneeId"
      label="Assignee"
      :allow-multiple="true"
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
        location="center"
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
        show-clear-button="true"
        display-expr="text"
        value-expr="id"
        :input-attr="{ 'aria-label': 'Select Employee' }"
        width="200"
        :value="assigneesFilterValue"
        @value-changed="onAssigneesFilterChange"
      />
    </template>
  </DxScheduler>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue';
import DxScheduler, {
  DxResource, DxToolbar, DxItem, DxSchedulerTypes,
} from 'devextreme-vue/scheduler';
import { DxSelectBox, type DxSelectBoxTypes } from 'devextreme-vue/select-box';
import { assignees, currentDate, schedulerDataSource } from './data.ts';

const views: DxSchedulerTypes.ViewType[] = ['day', 'week', 'workWeek', 'month'];
const assigneesFilterValue = ref([]);
const schedulerRef = ref<DxScheduler | null>(null);
const dataSource = ref(schedulerDataSource);

const newEventButtonOptions = {
  icon: 'plus',
  text: 'New Appointment',
  stylingMode: 'outlined',
  type: 'normal',
  onClick: () => {
    const scheduler = schedulerRef.value!.instance!;
    const selected = scheduler.option('selectedCellData') ?? [];

    if (selected.length) {
      scheduler.showAppointmentPopup({
        ...selected[0].groups,
        allDay: selected[0].allDay,
        startDate: new Date(selected[0].startDateUTC),
        endDate: new Date(selected.at(-1).endDateUTC),
      }, true);
    } else {
      const currentDate = scheduler.option('currentDate');
      const cellDuration = scheduler.option('cellDuration') as number;
      const cellDurationMs = cellDuration * 60 * 1000; // ms
      const currentTime = new Date(currentDate as Date).getTime();
      const roundTime = Math.round(currentTime / cellDurationMs) * cellDurationMs;

      scheduler.showAppointmentPopup({
        startDate: new Date(roundTime),
        endDate: new Date(roundTime + cellDurationMs),
      }, true);
    }
  },
};

function onAssigneesFilterChange(event: DxSelectBoxTypes.ValueChangedEvent) {
  const scheduler = schedulerRef.value!.instance!;
  const filter = event.value ? ['assigneeId', 'contains', event.value] : null;

  schedulerDataSource.filter(filter);
  scheduler.option('dataSource', schedulerDataSource);
  assigneesFilterValue.value = event.value;
}
</script>

<style scoped>
  .assignees-tag-box {
    min-width: 200px;
  }
</style>
