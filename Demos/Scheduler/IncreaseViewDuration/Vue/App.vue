<template>
  <DxScheduler
    time-zone="America/Los_Angeles"
    :data-source="dataSource"
    :current-date="currentDate"
    :views="views"
    :height="580"
    :start-day-hour="8"
    :first-day-of-week="1"
    current-view="day"
  />
</template>
<script setup lang="ts">
import { DxScheduler } from 'devextreme-vue/scheduler';
import { data } from './data.js';

const views = [
  {
    name: '3 Days', type: 'day', intervalCount: 3, startDate: new Date(2021, 3, 4),
  },
  {
    name: '2 Work Weeks', type: 'workWeek', intervalCount: 2, startDate: new Date(2021, 2, 4),
  },
  { name: '2 Months', type: 'month', intervalCount: 2 },
];
const currentDate = new Date(2021, 3, 5);
const dataSource = data;
</script>
