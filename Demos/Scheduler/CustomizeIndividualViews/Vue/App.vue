<template>
  <DxScheduler
    time-zone="America/Los_Angeles"
    :data-source="dataSource"
    :current-date="currentDate"
    :start-day-hour="7"
    :end-day-hour="23"
    :show-all-day-panel="false"
    height="600"
    current-view="workWeek"
  >
    <DxView
      type="day"
    />
    <DxView
      :groups="typeGroups"
      type="week"
      date-cell-template="dateCellSlot"
    />
    <DxView
      :groups="priorityGroups"
      :start-day-hour="9"
      :end-day-hour="18"
      type="workWeek"
      date-cell-template="dateCellSlot"
    />
    <DxView
      type="month"
    />
    <DxResource
      :data-source="priorityData"
      :allow-multiple="false"
      field-expr="priorityId"
      label="Priority"
    />
    <DxResource
      :data-source="typeData"
      :allow-multiple="false"
      field-expr="typeId"
      label="Type"
    />
    <template #dateCellSlot="{ data: dateCell }">
      <DateCell :cell-data="dateCell"/>
    </template>
  </DxScheduler>
</template>
<script>

import DxScheduler, { DxResource, DxView } from 'devextreme-vue/scheduler';

import DateCell from './DateCell.vue';
import { data, priorityData, typeData } from './data.js';

const currentDate = new Date(2021, 4, 25);

export default {
  components: {
    DxScheduler,
    DxResource,
    DateCell,
    DxView
  },
  data() {
    return {
      currentDate: currentDate,
      dataSource: data,
      priorityData: priorityData,
      typeData: typeData,
      typeGroups: ['typeId'],
      priorityGroups: ['priorityId'],
    };
  },
};
</script>

<style scoped>
  .dx-scheduler-work-space-week .dx-scheduler-header-panel-cell,
  .dx-scheduler-work-space-work-week .dx-scheduler-header-panel-cell {
    text-align: center;
    vertical-align: middle;
  }

  .dx-scheduler-work-space .dx-scheduler-header-panel-cell .name {
    font-size: 13px;
    line-height: 15px
  }

  .dx-scheduler-work-space .dx-scheduler-header-panel-cell .number {
    font-size: 15px;
    line-height: 15px
  }
</style>
