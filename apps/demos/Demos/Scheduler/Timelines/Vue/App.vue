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
      icon="user"
    />
    <DxResource
      :allow-multiple="false"
      :data-source="priorityData"
      field-expr="priority"
      label="Priority"
      icon="tags"
    />
  </DxScheduler>
</template>
<script setup lang="ts">
import {
  DxScheduler,
  DxResource,
  type DxSchedulerTypes,
} from 'devextreme-vue/scheduler';
import { data, priorityData, resourcesData } from './data.ts';

const views: DxSchedulerTypes.ViewType[] = ['timelineDay', 'timelineWeek', 'timelineWorkWeek', 'timelineMonth'];
const groups = ['priority'];
const currentDate = new Date(2021, 1, 2);
const dataSource = data;
</script>

<style scoped>
.dx-scheduler-timeline-day .dx-scheduler-cell-sizes-horizontal,
.dx-scheduler-timeline-week .dx-scheduler-cell-sizes-horizontal,
.dx-scheduler-timeline-work-week .dx-scheduler-cell-sizes-horizontal {
    width: 100px;
}
</style>
