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

    <DxEditing>
      <DxSchedulerForm>
        <DxItem name="mainGroup">
          <DxItem name="subjectGroup"/>
          <DxItem name="dateGroup"/>
          <DxItem name="repeatGroup"/>
          <DxItem name="resourcesGroup">
            <DxItem
              :col-count="3"
              :col-count-by-screen="{ xs: 3 }"
              name="ownerIdGroup"
            >
              <DxItem name="ownerIdIcon"/>
              <DxItem name="ownerId"/>
              <DxItem name="priority"/>
            </DxItem>
          </DxItem>
          <DxItem name="descriptionGroup"/>
        </DxItem>
        <DxItem name="recurrenceGroup"/>
      </DxSchedulerForm>
    </DxEditing>
  </DxScheduler>
</template>
<script setup lang="ts">
import {
  DxScheduler,
  DxResource,
  DxEditing,
  DxForm as DxSchedulerForm,
  type DxSchedulerTypes,
} from 'devextreme-vue/scheduler';
import { DxItem } from 'devextreme-vue/form';
import { data, priorityData, resourcesData } from './data.ts';

const views: DxSchedulerTypes.ViewType[] = ['timelineDay', 'timelineWeek', 'timelineWorkWeek', 'timelineMonth'];
const groups = ['priority'];
const currentDate = new Date(2021, 1, 2);
const dataSource = data;
</script>
