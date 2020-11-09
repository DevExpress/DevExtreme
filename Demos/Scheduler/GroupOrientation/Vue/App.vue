<template>
  <DxScheduler
    time-zone="America/Los_Angeles"
    :data-source="dataSource"
    :groups="groups"
    :current-date="currentDate"
    :start-day-hour="9"
    :end-day-hour="16"
    :cross-scrolling-enabled="true"
    :show-all-day-panel="false"
    :current-view="currentView"
  >
    <DxView
      :cell-duration="60"
      :interval-count="2"
      type="workWeek"
      name="Vertical Grouping"
      group-orientation="vertical"
    />
    <DxView
      :cell-duration="30"
      :interval-count="2"
      type="workWeek"
      name="Horizontal Grouping"
    />
    <DxResource
      :allow-multiple="false"
      :data-source="priorityData"
      field-expr="priorityId"
      label="Priority"
    />
  </DxScheduler>
</template>
<script>

import { DxScheduler, DxResource, DxView } from 'devextreme-vue/scheduler';

import { data, priorityData } from './data.js';

export default {
  components: {
    DxScheduler,
    DxResource,
    DxView
  },
  data() {
    return {
      currentView: 'Vertical Grouping',
      groups: ['priorityId'],
      currentDate: new Date(2021, 4, 21),
      dataSource: data,
      priorityData: priorityData
    };
  }
};
</script>

<style scoped>
.dx-scheduler-cell-sizes-horizontal {
    width: 100px;
}
</style>
