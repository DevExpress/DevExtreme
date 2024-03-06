<template>
  <DxScheduler
    time-zone="America/Los_Angeles"
    :data-source="dataSource"
    :current-date="currentDate"
    :views="views"
    :height="600"
    :start-day-hour="9"
    :end-day-hour="19"
    :remote-filtering="true"
    current-view="day"
    date-serialization-format="yyyy-MM-ddTHH:mm:ssZ"
    text-expr="Text"
    start-date-expr="StartDate"
    end-date-expr="EndDate"
    all-day-expr="AllDay"
  />
</template>
<script setup lang="ts">
import DxScheduler, { DxSchedulerTypes } from 'devextreme-vue/scheduler';
import { createStore } from 'devextreme-aspnet-data-nojquery';

const url = 'https://js.devexpress.com/Demos/Mvc/api/SchedulerData';
const views: DxSchedulerTypes.ViewType[] = ['day', 'workWeek', 'month'];
const currentDate = new Date(2021, 3, 27);
const dataSource = createStore({
  key: 'AppointmentId',
  loadUrl: `${url}/Get`,
  insertUrl: `${url}/Post`,
  updateUrl: `${url}/Put`,
  deleteUrl: `${url}/Delete`,
  onBeforeSend(_, ajaxOptions) {
    ajaxOptions.xhrFields = { withCredentials: true };
  },
});
</script>
