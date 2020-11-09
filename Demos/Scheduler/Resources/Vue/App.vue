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
        :data-source="owners"
        :use-color-as-default="radioGroupValue === 'Owner'"
        field-expr="ownerId"
        label="Owner"
      />
      <DxResource
        :data-source="rooms"
        :use-color-as-default="radioGroupValue === 'Room'"
        field-expr="roomId"
        label="Room"
      />
      <DxResource
        :data-source="priorities"
        :use-color-as-default="radioGroupValue === 'Priority'"
        field-expr="priorityId"
        label="Priority"
      />
    </DxScheduler>
    <div class="options">
      <div class="caption">Use colors of:</div>
      <div class="option">
        <DxRadioGroup
          :items="resources"
          :value="radioGroupValue"
          :on-value-changed="onRadioGroupValueChanged"
          layout="horizontal"
        />
      </div>
    </div>
  </div>
</template>
<script>

import DxScheduler, { DxResource } from 'devextreme-vue/scheduler';

import DxRadioGroup from 'devextreme-vue/radio-group';

import { resourcesList, data, priorities, owners, rooms } from './data.js';

export default {
  components: {
    DxScheduler,
    DxResource,
    DxRadioGroup
  },
  data() {
    return {
      views: ['workWeek'],
      currentDate: new Date(2021, 4, 25),
      radioGroupValue: 'Owner',
      dataSource: data,
      resources: resourcesList,
      owners: owners,
      priorities: priorities,
      rooms: rooms,
    };
  },
  methods: {
    onRadioGroupValueChanged: function(e) {
      this.radioGroupValue = e.value;
    }
  }
};
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
