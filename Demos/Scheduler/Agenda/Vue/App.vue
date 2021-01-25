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
      :data-source="owners"
      :use-color-as-default="true"
      field-expr="ownerId"
      label="Owner"
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

import { data, owners, priorities } from './data.js';

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
      owners: owners,
      priorities: priorities,
    };
  }
};
</script>
