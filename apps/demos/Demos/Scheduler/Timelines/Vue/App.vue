<template>
  <DxScheduler
    time-zone="America/Los_Angeles"
    :data-source="data"
    :views="['timelineDay', 'timelineWeek', 'timelineWorkWeek', 'timelineMonth']"
    current-view="timelineMonth"
    :current-date="new Date(2021, 1, 2)"
    height="580"
    :groups="['priority']"
    :cell-duration="60"
    :first-day-of-week="0"
    :start-day-hour="8"
    :end-day-hour="20"
    :snap-to-cells-mode="snapToCellsMode"
  >
    <DxResource
      field-expr="ownerId"
      :allow-multiple="true"
      :data-source="resourcesData"
      label="Owner"
      :use-color-as-default="true"
      icon="user"
    />
    <DxResource
      field-expr="priority"
      :allow-multiple="false"
      :data-source="priorityData"
      label="Priority"
      icon="tags"
    />
  </DxScheduler>
  <div class="options">
    <div class="option">
      <span>Snap to Cells Mode:</span>
      <DxSelectBox
        :items="[
          { value: 'auto', text: 'Auto' },
          { value: 'always', text: 'Always' },
          { value: 'never', text: 'Never' },
        ]"
        value-expr="value"
        display-expr="text"
        :value="snapToCellsMode"
        @value-changed="onSnapToCellsModeChanged"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import {
  DxScheduler,
  DxResource,
  type DxSchedulerTypes,
} from 'devextreme-vue/scheduler';
import DxSelectBox, { type DxSelectBoxTypes } from 'devextreme-vue/select-box';
import { data, resourcesData, priorityData } from './data.ts';

const snapToCellsMode = ref<DxSchedulerTypes.SnapToCellsMode>('always');

function onSnapToCellsModeChanged(e: DxSelectBoxTypes.ValueChangedEvent) {
  snapToCellsMode.value = e.value;
}
</script>

<style scoped>
.dx-scheduler-timeline-day .dx-scheduler-cell-sizes-horizontal,
.dx-scheduler-timeline-week .dx-scheduler-cell-sizes-horizontal,
.dx-scheduler-timeline-work-week .dx-scheduler-cell-sizes-horizontal {
    width: 100px;
}

.options {
  padding: 20px;
  background-color: rgba(191, 191, 191, 0.15);
  margin-top: 20px;
}

.option {
  margin-top: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
}
</style>
