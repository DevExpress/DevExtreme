<template>
  <DxScheduler
    time-zone="America/Los_Angeles"
    :data-source="dataSource"
    :current-date="currentDate"
    :views="views"
    :height="600"
    :start-day-hour="9"
    current-view="agenda"
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
      views: ['agenda'],
      currentDate: new Date(2021, 4, 11),
      dataSource: data
    };
  }
};
</script>
