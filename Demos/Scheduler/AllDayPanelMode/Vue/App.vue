<template>
  <div>
    <DxScheduler
      time-zone="America/Los_Angeles"
      :data-source="data"
      :current-date="currentDate"
      :views="views"
      :height="600"
      :start-day-hour="9"
      :all-day-panel-mode="allDayPanelMode"
      current-view="day"
    />
    <div class="options">
      <div class="option">
        <div class="label">All day panel mode</div>
        <div class="value">
          <DxRadioGroup
            :items="allDayPanelItems"
            v-model:value="allDayPanelMode"
            layout="horizontal"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import DxScheduler from 'devextreme-vue/scheduler';
import { DxRadioGroup } from 'devextreme-vue/radio-group';
import { data } from './data.js';

const currentDate = new Date(2021, 2, 28);
const views = [
  {
    type: 'day',
    name: '4 Days',
    intervalCount: 4,
  },
  'week',
];
const allDayPanelItems = ['all', 'allDay', 'hidden'];
const allDayPanelMode = ref('allDay');
</script>
