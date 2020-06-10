<template>
  <DxScheduler
    :data-source="dataSource"
    :current-date="currentDate"
    :views="views"
    :height="580"
    :start-day-hour="8"
    :first-day-of-week="1"
    current-view="day"
  />
</template>
<script>

import { DxScheduler } from 'devextreme-vue/scheduler';

import { data } from './data.js';

export default {
  components: {
    DxScheduler
  },
  data() {
    return {
      views: [
        { name: '3 Days', type: 'day', intervalCount: 3, startDate: new Date(2017, 3, 30) },
        { name: '2 Work Weeks', type: 'workWeek', intervalCount: 2, startDate: new Date(2017, 3, 3) },
        { name: '2 Months', type: 'month', intervalCount: 2 }
      ],
      currentDate: new Date(2017, 4, 1),
      dataSource: data
    };
  }
};
</script>
