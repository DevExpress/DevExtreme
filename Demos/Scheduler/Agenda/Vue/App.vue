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
    />
    <DxResource
      :data-source="priorities"
      field-expr="priorityId"
      label="Priority"
    />
  </DxScheduler>
</template>
<script>
import DxScheduler, { DxResource } from 'devextreme-vue/scheduler';

import { data, assignees, priorities } from './data.js';

export default {
  components: {
    DxScheduler,
    DxResource
  },
  data() {
    return {
      views: ['agenda'],
      currentDate: new Date(2021, 4, 11),
      dataSource: data,
      assignees: assignees,
      priorities: priorities,
    };
  }
};
</script>
