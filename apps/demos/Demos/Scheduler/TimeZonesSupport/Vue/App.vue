<template>
  <div>
    <div class="option">
      <span>Office Time Zone</span>
      <DxSelectBox
        :items="timeZones"
        v-model:value="currentTimeZone"
        :input-attr="{ 'aria-label': 'Time zone' }"
        :width="240"
        display-expr="title"
        value-expr="id"
      />
    </div>
    <DxScheduler
      :data-source="dataSource"
      :current-date="currentDate"
      :views="views"
      :height="600"
      :start-day-hour="8"
      :time-zone="currentTimeZone"
      current-view="workWeek"
      :on-appointment-form-opening="onAppointmentFormOpening"
      :on-option-changed="onOptionChanged"
    >
      <DxEditing
        :allow-time-zone-editing="true"
      />
    </DxScheduler>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import DxScheduler, { DxEditing, DxSchedulerTypes } from 'devextreme-vue/scheduler';
import DxSelectBox from 'devextreme-vue/select-box';
import { getTimeZones as getTimeZonesUtility } from 'devextreme/time_zone_utils';
import DataSource from 'devextreme/data/data_source';
import { data, locations } from './data.ts';

const views = ['workWeek'];
const dataSource = data;
const currentDate = new Date(2021, 3, 27);

const getTimeZones = function(date: Date) {
  const timeZones = getTimeZonesUtility(date);
  return timeZones.filter((timeZone) => locations.indexOf(timeZone.id) !== -1);
};

const timeZones = ref(getTimeZones(currentDate));
const currentTimeZone = ref(timeZones.value[0].id);
function onAppointmentFormOpening(args: DxSchedulerTypes.AppointmentFormOpeningEvent) {
  const { form } = args;

  const startDateTimezoneEditor = form.getEditor('startDateTimeZone');
  const endDateTimezoneEditor = form.getEditor('endDateTimeZone');
  const startDateDataSource = startDateTimezoneEditor.option('dataSource') as DataSource;
  const endDateDataSource = endDateTimezoneEditor.option('dataSource') as DataSource;

  startDateDataSource.filter(['id', 'contains', 'Europe']);
  endDateDataSource.filter(['id', 'contains', 'Europe']);

  startDateDataSource.load();
  endDateDataSource.load();
}
function onOptionChanged(args) {
  if (args.name === 'currentDate') {
    timeZones.value = getTimeZones(args.value);
  }
}
</script>

<style scoped>
  .option {
    display: flex;
  }

  .option > span {
    display: flex;
    align-items: center;
    margin-right: 10px;
  }

  .dx-scheduler {
    margin-top: 20px;
  }
</style>
