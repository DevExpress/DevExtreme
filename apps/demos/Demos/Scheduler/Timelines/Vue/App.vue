<template>
  <DxScheduler
    time-zone="America/Los_Angeles"
    :data-source="dataSource"
    :current-date="currentDate"
    :views="views"
    :height="580"
    :cell-duration="60"
    :start-day-hour="8"
    :end-day-hour="20"
    :groups="groups"
    :first-day-of-week="0"
    current-view="timelineMonth"
  >
    <DxResource
      :allow-multiple="true"
      :data-source="resourcesData"
      :use-color-as-default="true"
      field-expr="ownerId"
      label="Owner"
    />
    <DxResource
      :allow-multiple="false"
      :data-source="priorityData"
      field-expr="priority"
      label="Priority"
    />
  </DxScheduler>
</template>
<script setup lang="ts">
import { DxScheduler, DxResource, DxSchedulerTypes } from 'devextreme-vue/scheduler';
import { data, priorityData, resourcesData } from './data.ts';

const views: DxSchedulerTypes.ViewType[] = ['timelineDay', 'timelineWeek', 'timelineWorkWeek', 'timelineMonth'];
const groups = ['priority'];
const currentDate = new Date(2021, 1, 2);
const dataSource = data;
</script>
