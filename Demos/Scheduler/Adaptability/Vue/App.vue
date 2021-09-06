<template>
  <div>
    <DxScheduler
      :ref="schedulerRef"
      time-zone="America/Los_Angeles"
      :data-source="dataSource"
      v-model:current-date="currentDate"
      :cell-duration="cellDuration"
      :views="views"
      :height="590"
      :start-day-hour="9"
      :adaptivity-enabled="true"
      :on-content-ready="onContentReady"
      current-view="month"
    >
      <DxResource
        :data-source="priorities"
        field-expr="priorityId"
        label="Priority"
      />
    </DxScheduler>
    <DxSpeedDialAction
      :on-click="showPopup"
      icon="plus"
    />
  </div>
</template>
<script>

import DxScheduler, { DxResource } from 'devextreme-vue/scheduler';
import DxSpeedDialAction from 'devextreme-vue/speed-dial-action';

import { data, priorities } from './data.js';

const schedulerRef = 'scheduler-ref';

export default {
  components: {
    DxScheduler,
    DxResource,
    DxSpeedDialAction
  },
  data() {
    return {
      views: ['week', 'month'],
      currentDate: new Date(2021, 2, 25),
      cellDuration: 30,
      dataSource: data,
      priorities: priorities,
      schedulerRef
    };
  },
  methods: {
    showPopup: function() {
      this.$refs[schedulerRef].instance.showAppointmentPopup();
    }
  }
};
</script>
