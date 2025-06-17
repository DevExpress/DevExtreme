<template>
  <DxCardView
    :data-source="tasks"
    key-expr="Task_ID"
    :cards-per-row="2"
  >
    <DxPaging
      :page-size="4"
    />
    <DxSearchPanel
      :visible="true"
      text="an"
    />
    <DxHeaderFilter
      :visible="true"
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
import { DxCardView, DxColumn, DxPaging, DxSearchPanel, DxHeaderFilter } from 'devextreme-vue/card-view';
import { tasks } from './data.ts';
</script>
