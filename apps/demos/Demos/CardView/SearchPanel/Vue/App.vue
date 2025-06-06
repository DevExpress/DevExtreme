<template>
  <DxCardView
    :data-source="tasks"
    key-expr="Task_ID"
    :cards-per-row="2"
    :header-filter="headerFilterConfig"
    :search-panel="searchPanelConfig"
  >
    <DxPaging
      :page-size="4"
    />
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
import { DxCardView, DxColumn, DxPaging } from 'devextreme-vue/card-view';
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
