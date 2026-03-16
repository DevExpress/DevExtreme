<template>
  <div>
    <DxScheduler
      time-zone="America/Los_Angeles"
      :data-source="dataSource"
      :current-date="currentDate"
      :views="views"
      :height="600"
      :start-day-hour="9"
      :first-day-of-week="1"
      current-view="workWeek"
    >
      <DxResource
        :data-source="rooms"
        :use-color-as-default="currentResource === 'Room'"
        field-expr="roomId"
        label="Room"
        icon="conferenceroomoutline"
      />
      <DxResource
        :data-source="priorities"
        :use-color-as-default="currentResource === 'Priority'"
        field-expr="priorityId"
        label="Priority"
        icon="tags"
      />
      <DxResource
        :data-source="assignees"
        :use-color-as-default="currentResource === 'Assignee'"
        field-expr="assigneeId"
        label="Assignee"
        :allow-multiple="true"
        icon="user"
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
                name="roomIdGroup"
              >
                <DxItem name="roomIdIcon"/>
                <DxItem name="roomIdEditor"/>
                <DxItem name="priorityIdEditor"/>
              </DxItem>
              <DxItem name="assigneeIdGroup"/>
            </DxItem>
            <DxItem name="descriptionGroup"/>
          </DxItem>
          <DxItem name="recurrenceGroup"/>
        </DxSchedulerForm>
      </DxEditing>
    </DxScheduler>
    <div class="options">
      <div class="caption">Use colors of:</div>
      <div class="option">
        <DxRadioGroup
          :items="resources"
          :value="currentResource"
          :on-value-changed="onRadioGroupValueChanged"
          layout="horizontal"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import DxScheduler, {
  DxResource,
  DxEditing,
  DxForm as DxSchedulerForm,
  type DxSchedulerTypes,
} from 'devextreme-vue/scheduler';
import { DxItem } from 'devextreme-vue/form';
import DxRadioGroup, { type DxRadioGroupTypes } from 'devextreme-vue/radio-group';
import {
  resourcesList, data, priorities, assignees, rooms,
} from './data.ts';

const views: DxSchedulerTypes.ViewType[] = ['workWeek'];
const currentDate = new Date(2021, 3, 27);
const currentResource = ref('Assignee');
const dataSource = data;
const resources = resourcesList;

function onRadioGroupValueChanged(e: DxRadioGroupTypes.ValueChangedEvent) {
  currentResource.value = e.value;
}
</script>

<style scoped>
  .options {
    padding: 20px;
    background-color: rgba(191, 191, 191, 0.15);
    margin-top: 20px;
  }

  .caption {
    font-size: 18px;
    font-weight: 500;
  }

  .option {
    margin-top: 10px;
    display: inline-block;
  }
</style>
