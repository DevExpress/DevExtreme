<template>
  <DxScheduler
    :data-source="dataSource"
    :current-date="currentDate"
    :height="730"
    :start-day-hour="8"
    :end-day-hour="20"
    :cell-duration="60"
    :current-view="currentView"
    :show-all-day-panel="false"
    :groups="groups"
  >
    <DxView
      type="timelineWorkWeek"
      name="Timeline"
      group-orientation="vertical"
    />
    <DxView
      type="workWeek"
      group-orientation="vertical"
    />
    <DxView
      type="month"
      group-orientation="horizontal"
    />
    <DxResource
      :data-source="resources"
      field-expr="humanId"
      label="Employee"
    />
    <DxScrolling
      mode="virtual"
    />
  </DxScheduler>
</template>
<script setup lang="ts">
import DxScheduler, { DxResource, DxView, DxScrolling } from 'devextreme-vue/scheduler';
import { resources, generateAppointments } from './data.ts';

const dataSource = generateAppointments(new Date(2021, 1, 1), new Date(2021, 1, 28), 8, 20);
const currentDate = new Date(2021, 1, 2);
const currentView = 'Timeline';
const groups = ['humanId'];
</script>
