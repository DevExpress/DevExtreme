<template>
  <DxScheduler
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
    />
    <DxResource
      :allow-multiple="false"
      :data-source="priorityData"
      field-expr="priority"
      label="Priority"
    />
  </DxScheduler>
</template>
<script>
import { DxScheduler, DxResource } from 'devextreme-vue/scheduler';

import { data, priorityData, resourcesData } from './data.js';

export default {
  components: {
    DxScheduler,
    DxResource
  },
  data() {
    return {
      views: ['timelineDay', 'timelineWeek', 'timelineWorkWeek', 'timelineMonth'],
      groups: ['priority'],
      currentDate: new Date(2021, 1, 2),
      dataSource: data,
      priorityData: priorityData,
      resourcesData: resourcesData
    };
  }
};
</script>
