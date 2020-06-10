<template>
  <div>
    <div class="option">
      <span>Office Time Zone</span>
      <DxSelectBox
        :items="locationsData"
        :value.sync="timezone"
        :width="240"
        display-expr="text"
        value-expr="timeZoneId"
      />
    </div>
    <DxScheduler
      :data-source="dataSource"
      :current-date="currentDate"
      :views="views"
      :height="600"
      :time-zone="timezone"
      current-view="workWeek"
    >
      <DxEditing
        :allow-editing-time-zones="true"
      />
    </DxScheduler>
  </div>
</template>
<script>

import DxScheduler, { DxEditing } from 'devextreme-vue/scheduler';
import DxSelectBox from 'devextreme-vue/select-box';

import { data, locations } from './data.js';

export default {
  components: {
    DxScheduler,
    DxSelectBox,
    DxEditing
  },
  data() {
    return {
      views: ['workWeek'],
      currentDate: new Date(2017, 4, 25),
      timezone: locations[0].timeZoneId,
      dataSource: data,
      locationsData: locations
    };
  }
};
</script>

<style scoped>
  .option {
    display: flex;
  }

  .option > span {
    display: flex;
    align-items: center;
    margin-right: 10px;
  }

  .dx-scheduler {
    margin-top: 20px;
  }
</style>
