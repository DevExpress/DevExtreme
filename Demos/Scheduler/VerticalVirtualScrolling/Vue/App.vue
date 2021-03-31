<template>
  <DxScheduler
    :data-source="dataSource"
    :current-date="currentDate"
    :views="views"
    :height="600"
    :start-day-hour="9"
    :end-day-hour="18"
    current-view="3 Days"
    :scrolling="scrolling"
    :show-all-day-panel="false"
    :groups="groups"
    :resources="resources"
  />
</template>
<script>
import DxScheduler from 'devextreme-vue/scheduler';
import { generateResources, generateAppointments } from './data.js';

export default {
  components: {
    DxScheduler,
  },
  data() {
    return {
      dataSource: generateAppointments(),
      currentDate: new Date(2021, 8, 6),
      views: [
        {
          type: 'day',
          groupOrientation: 'vertical',
          name: '2 Days',
          intervalCount: 2,
        },
        {
          type: 'day',
          groupOrientation: 'vertical',
          name: '3 Days',
          intervalCount: 3,
        },
        {
          type: 'workWeek',
          name: 'Work Week',
          groupOrientation: 'vertical',
        },
        {
          type: 'month',
          groupOrientation: 'vertical'
        }
      ],
      scrolling: { mode: 'virtual' },
      groups: ['resourceId'],
      resources: [{
        fieldExpr: 'resourceId',
        dataSource: generateResources()
      }]
    };
  },
};
</script>
