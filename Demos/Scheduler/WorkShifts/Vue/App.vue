<template>
  <div class="options">
    <div class="option">
      <div class="label">Work Hours</div>
      <div class="value">
        <DxRadioGroup
          :items="shifts"
          :value="shifts[0]"
          layout="horizontal"
          :on-value-changed="onShiftChanged"
        />
      </div>
    </div>
  </div>
  <br>
  <DxScheduler
    time-zone="America/Los_Angeles"
    :data-source="appointments"
    :current-date="currentDate"
    :views="views"
    current-view="week"
    :start-day-hour="0"
    :end-day-hour="8"
    :offset="currentOffset"
    :cell-duration="60"
    :show-all-day-panel="false"
  />
</template>
<script setup lang="ts">
import { ref } from 'vue';
import DxScheduler from 'devextreme-vue/scheduler';
import DxRadioGroup, { DxRadioGroupTypes } from 'devextreme-vue/radio-group';
import { appointments, shifts } from './data.ts';

const views = ['day', 'week'];
const currentDate = new Date(2021, 2, 30);
const currentOffset = ref(shifts[0].offset);

function onShiftChanged(e: DxRadioGroupTypes.ValueChangedEvent) {
  currentOffset.value = e.value.offset as number;
}

</script>

<style scoped>
.options {
  background-color: rgba(191, 191, 191, 0.15);
  margin-top: 20px;
  display: flex;
  align-items: flex-start;
  height: 100%;
}

.option {
  padding: 16px;
  display: flex;
  align-items: center;
}

.label,
.value {
  display: inline-block;
  vertical-align: middle;
}

.label {
  width: 100px;
}
</style>
