<template>
  <DxScheduler
    :data-source="dataSource"
    :current-date="currentDate"
    :views="views"
    :height="600"
    :first-day-of-week="0"
    :start-day-hour="8"
    :end-day-hour="20"
    :cell-duration="60"
    :current-view="currentView"
    :scrolling="scrolling"
    :show-all-day-panel="false"
    :groups="groups"
    :resources="resources"
  />
</template>
<script>
import DxScheduler from 'devextreme-vue/scheduler';
import { humans, generateAppointments } from './data.js';

export default {
  components: {
    DxScheduler,
  },
  data() {
    return {
      dataSource: generateAppointments(),
      currentDate: new Date(2021, 1, 2),
      views: [
        {
          type: 'timelineWorkWeek',
          name: 'Timeline',
          groupOrientation: 'vertical'
        },
        {
          type: 'workWeek',
          groupOrientation: 'vertical'
        },
        {
          type: 'month',
          groupOrientation: 'horizontal'
        }
      ],
      currentView: 'timelineWorkWeek',
      scrolling: {
        mode: 'virtual'
      },
      groups: ['humanId'],
      resources: [{
        fieldExpr: 'humanId',
        dataSource: humans
      }]
    };
  },
};
</script>
