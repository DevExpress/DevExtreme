<template>
  <DxScheduler
    time-zone="America/Los_Angeles"
    :data-source="dataSource"
    :current-date="currentDate"
    :views="views"
    :height="730"
    :start-day-hour="9"
    current-view="week"
  />
</template>
<script setup lang="ts">
import DxScheduler from 'devextreme-vue/scheduler';
import { data } from './data.js';

const views = ['week', 'month'];
const currentDate = new Date(2021, 2, 28);
const dataSource = data;
</script>
