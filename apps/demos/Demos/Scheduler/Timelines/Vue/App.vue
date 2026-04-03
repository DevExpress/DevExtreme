<template>
  <DxScheduler
    time-zone="America/Los_Angeles"
    :data-source="dataSource"
    :current-date="currentDate"
    :views="views"
    :height="580"
    :cell-duration="60"
    :start-day-hour="8"
    :end-day-hour="20"
    :groups="groups"
    :first-day-of-week="0"
    :snap-to-cells-mode="snapToCellsMode"
    current-view="timelineMonth"
  >
    <DxResource
      :allow-multiple="true"
      :data-source="resourcesData"
      :use-color-as-default="true"
      field-expr="ownerId"
      label="Owner"
      icon="user"
    />
    <DxResource
      :allow-multiple="false"
      :data-source="priorityData"
      field-expr="priority"
      label="Priority"
      icon="tags"
    />
  </DxScheduler>
  <div class="options">
    <div class="option">
      <span>Snap to Cells Mode:</span>
      <DxSelectBox
        :items="snapToCellsModeItems"
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
import { data, priorityData, resourcesData } from './data.ts';

const views: DxSchedulerTypes.ViewType[] = ['timelineDay', 'timelineWeek', 'timelineWorkWeek', 'timelineMonth'];
const groups = ['priority'];
const currentDate = new Date(2021, 1, 2);
const dataSource = data;

const snapToCellsModeItems: { value: DxSchedulerTypes.SnapToCellsMode; text: string }[] = [
  { value: 'auto', text: 'Auto' },
  { value: 'always', text: 'Always' },
  { value: 'never', text: 'Never' },
];

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
