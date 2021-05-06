<template>
  <DxScheduler
    time-zone="America/Los_Angeles"
    :data-source="dataSource"
    :current-date="currentDate"
    :views="views"
    :height="600"
    :start-day-hour="9"
    current-view="week"
  />
</template>
<script>

import DxScheduler from 'devextreme-vue/scheduler';

import { data } from './data.js';

export default {
  components: {
    DxScheduler
  },
  data() {
    return {
      views: ['week', 'month'],
      currentDate: new Date(2021, 2, 28),
      dataSource: data
    };
  }
};
</script>
