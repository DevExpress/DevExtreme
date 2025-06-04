<template>
  <DxCardView
    :data-source="tasks"
    key-expr="Task_ID"
    :card-min-width="100"
    :word-wrap-enabled="true"
    :header-filter="headerFilterConfig"
    :search-panel="searchPanelConfig"
  >
    <DxColumn
      data-field="Task_Subject"
      caption="Subject"
    />
    <DxColumn
      data-field="Task_Start_Date"
      caption="Start Date"
      data-type="date"
    />
    <DxColumn
      data-field="Task_Due_Date"
      caption="Due Date"
      data-type="date"
    />
    <DxColumn
      data-field="Task_Priority"
      caption="Priority"
    />
    <DxColumn
      data-field="Task_Status"
      caption="Status"
    />
  </DxCardView>
</template>
<script setup lang="ts">
import { DxCardView, DxColumn } from 'devextreme-vue/card-view';
import { tasks } from './data.ts';

// TODO: Nested component does not exist
const headerFilterConfig = {
  visible: true,
};

// TODO: Nested component does not exist
const searchPanelConfig = {
  visible: true,
  text: 'an',
};
</script>
