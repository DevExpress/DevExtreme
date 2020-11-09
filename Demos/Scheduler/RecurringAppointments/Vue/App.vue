<template>
  <DxScheduler
    time-zone="America/Los_Angeles"
    :data-source="dataSource"
    :current-date="currentDate"
    :views="views"
    :height="600"
    :start-day-hour="9"
    :first-day-of-week="1"
    current-view="month"
  >
    <DxResource
      :data-source="resourcesData"
      field-expr="roomId"
      label="Room"
    />
  </DxScheduler>
</template>
<script>

import { DxScheduler, DxResource } from 'devextreme-vue/scheduler';

import { data, resourcesData } from './data.js';

export default {
  components: {
    DxScheduler,
    DxResource
  },
  data() {
    return {
      views: ['day', 'week', 'month'],
      currentDate: new Date(2021, 2, 25),
      dataSource: data,
      resourcesData: resourcesData
    };
  }
};
</script>
