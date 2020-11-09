<template>
  <DxScheduler
    time-zone="America/Los_Angeles"
    :data-source="dataSource"
    :current-date="currentDate"
    :views="views"
    :current-view="currentView"
    :height="600"
    :show-all-day-panel="false"
    :first-day-of-week="0"
    :start-day-hour="9"
    :end-day-hour="19"
    data-cell-template="dataCellTemplate"
    date-cell-template="dateCellTemplate"
    time-cell-template="timeCellTemplate"
    :on-appointment-form-opening="onAppointmentFormOpening"
    :on-appointment-adding="onAppointmentAdding"
    :on-appointment-updating="onAppointmentUpdating"
  >

    <template #dataCellTemplate="{ data: cellData }">
      <DataCell :cell-data="cellData"/>
    </template>

    <template #dateCellTemplate="{ data: cellData }">
      <DateCell :cell-data="cellData"/>
    </template>

    <template #timeCellTemplate="{ data: cellData }">
      <TimeCell :cell-data="cellData"/>
    </template>

  </DxScheduler>
</template>
<script>

import { DxScheduler } from 'devextreme-vue/scheduler';
import { data, holidays } from './data.js';
import notify from 'devextreme/ui/notify';
import Utils from './utils.js';

import DataCell from './DataCell.vue';
import DateCell from './DateCell.vue';
import TimeCell from './TimeCell.vue';

export default {
  components: {
    DxScheduler,
    DataCell,
    DateCell,
    TimeCell
  },
  data() {
    return {
      views: ['workWeek', 'month'],
      currentView: 'workWeek',
      currentDate: new Date(2021, 4, 25),
      dataSource: data
    };
  },
  methods: {
    onAppointmentFormOpening: function(e) {
      const startDate = new Date(e.appointmentData.startDate);
      if(!Utils.isValidAppointmentDate(startDate)) {
        e.cancel = true;
        this.notifyDisableDate();
      }
      this.applyDisableDatesToDateEditors(e.form);
    },

    onAppointmentAdding: function(e) {
      const isValidAppointment = Utils.isValidAppointment(e.component, e.appointmentData);
      if(!isValidAppointment) {
        e.cancel = true;
        this.notifyDisableDate();
      }
    },

    onAppointmentUpdating(e) {
      const isValidAppointment = Utils.isValidAppointment(e.component, e.newData);
      if(!isValidAppointment) {
        e.cancel = true;
        this.notifyDisableDate();
      }
    },

    notifyDisableDate() {
      notify('Cannot create or move an appointment/event to disabled time/date regions.', 'warning', 1000);
    },

    applyDisableDatesToDateEditors(form) {
      const startDateEditor = form.getEditor('startDate');
      startDateEditor.option('disabledDates', holidays);

      const endDateEditor = form.getEditor('endDate');
      endDateEditor.option('disabledDates', holidays);
    }
  }
};
</script>
