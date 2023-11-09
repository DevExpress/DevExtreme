<template>
  <DxGantt
    :task-list-width="500"
    :height="700"
    scale-type="weeks"
    :root-value="-1"
  >

    <DxTasks :data-source="tasks"/>
    <DxDependencies :data-source="dependencies"/>
    <DxResources :data-source="resources"/>
    <DxResourceAssignments :data-source="resourceAssignments"/>

    <DxEditing :enabled="true"/>

    <DxColumn
      :width="300"
      data-field="title"
      caption="Subject"
    />
    <DxColumn
      data-field="start"
      caption="Start Date"
    />
    <DxColumn
      data-field="end"
      caption="End Date"
    />
    <DxGanttHeaderFilter :visible="true"/>
  </DxGantt>
</template>
<script setup lang="ts">
import {
  DxGantt,
  DxTasks,
  DxDependencies,
  DxResources,
  DxResourceAssignments,
  DxColumn,
  DxEditing,
  DxGanttHeaderFilter,
} from 'devextreme-vue/gantt';
import {
  tasks,
  dependencies,
  resources,
  resourceAssignments,
} from './data.js';
</script>
