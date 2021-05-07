<template>
  <DxScheduler
    :data-source="dataSource"
    :current-date="currentDate"
    :views="views"
    :height="600"
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
import {
  resources,
  generateAppointments
} from './data.js';

export default {
  components: {
    DxScheduler,
  },
  data() {
    return {
      dataSource: generateAppointments(new Date(2021, 1, 1), new Date(2021, 1, 28), 8, 20),
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
      currentView: 'Timeline',
      scrolling: {
        mode: 'virtual'
      },
      groups: ['humanId'],
      resources: [{
        fieldExpr: 'humanId',
        dataSource: resources,
        label: 'Employee'
      }]
    };
  },
};
</script>
