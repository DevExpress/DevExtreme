<template>
  <DxScheduler
    time-zone="America/Los_Angeles"
    :data-source="dataSource"
    :current-date="currentDate"
    :views="views"
    :height="730"
    :start-day-hour="9"
    current-view="month"
  >
    <DxResource
      :data-source="resourcesData"
      field-expr="roomId"
      label="Room"
    />
  </DxScheduler>
</template>
<script setup lang="ts">
import { DxScheduler, DxResource, DxSchedulerTypes } from 'devextreme-vue/scheduler';
import { data, resourcesData } from './data.ts';

const views: DxSchedulerTypes.ViewType[] = ['day', 'week', 'month'];
const currentDate = new Date(2020, 10, 25);
const dataSource = data;
</script>
