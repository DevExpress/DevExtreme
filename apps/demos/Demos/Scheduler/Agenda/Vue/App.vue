<template>
  <DxScheduler
    time-zone="America/Los_Angeles"
    :data-source="dataSource"
    :current-date="currentDate"
    :views="views"
    :height="600"
    :start-day-hour="9"
    current-view="agenda"
  >
    <DxResource
      :data-source="assignees"
      :use-color-as-default="true"
      :allow-multiple="true"
      field-expr="assigneeId"
      label="Assignee"
      icon="user"
    />
    <DxResource
      :data-source="priorities"
      field-expr="priorityId"
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
              name="assigneeIdGroup"
            >
              <DxItem name="assigneeIdIcon"/>
              <DxItem name="assigneeId"/>
              <DxItem name="priorityId"/>
            </DxItem>
          </DxItem>
        </DxItem>
        <DxItem name="recurrenceGroup"/>
      </DxSchedulerForm>
    </DxEditing>
  </DxScheduler>
</template>
<script setup lang="ts">
import DxScheduler, {
  DxResource,
  DxEditing,
  DxForm as DxSchedulerForm,
} from 'devextreme-vue/scheduler';
import { DxItem } from 'devextreme-vue/form';
import { ArrayStore } from 'devextreme-vue/common/data';
import { data, assignees, priorities } from './data.ts';

const views = ['agenda'];
const currentDate = new Date(2021, 4, 11);
const dataSource = new ArrayStore({
  key: 'id',
  data,
});
</script>
