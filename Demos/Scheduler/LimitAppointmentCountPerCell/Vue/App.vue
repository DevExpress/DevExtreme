<template>
  <div>
    <DxScheduler
      time-zone="America/Los_Angeles"
      :data-source="dataSource"
      :current-date="currentDate"
      :height="650"
      current-view="month"
    >
      <DxResource
        :data-source="resourcesData"
        field-expr="roomId"
        label="Room"
      />
      <DxView
        type="month"
        name="Auto Mode"
        max-appointments-per-cell="auto"
      />
      <DxView
        type="month"
        name="Unlimited Mode"
        max-appointments-per-cell="unlimited"
      />
      <DxView
        :max-appointments-per-cell="2"
        type="month"
        name="Numeric Mode"
      />
    </DxScheduler>
  </div>
</template>

<script>
import DxScheduler, { DxResource, DxView } from 'devextreme-vue/scheduler';

import { resourcesData, data } from './data.js';

export default {
  components: {
    DxScheduler,
    DxResource,
    DxView
  },
  data() {
    return {
      currentDate: new Date(2021, 4, 25),
      dataSource: data,
      resourcesData: resourcesData,
    };
  }
};
</script>
