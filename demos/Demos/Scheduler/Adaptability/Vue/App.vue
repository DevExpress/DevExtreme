<template>
  <div>
    <DxScheduler
      ref="schedulerRef"
      time-zone="America/Los_Angeles"
      :data-source="dataSource"
      :current-date="currentDate"
      :cell-duration="cellDuration"
      :views="views"
      :height="590"
      :start-day-hour="9"
      :adaptivity-enabled="true"
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
<script setup lang="ts">
import { ref } from 'vue';
import DxScheduler, { DxResource } from 'devextreme-vue/scheduler';
import DxSpeedDialAction from 'devextreme-vue/speed-dial-action';
import { data, priorities } from './data.ts';

const views = ['week', 'month'];
const currentDate = new Date(2021, 2, 25);
const cellDuration = 30;
const dataSource = data;
const schedulerRef = ref<DxScheduler>();
function showPopup() {
  schedulerRef.value?.instance?.showAppointmentPopup();
}
</script>
