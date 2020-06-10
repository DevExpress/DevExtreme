<template>
  <DxGantt
    :task-list-width="500"
    :height="700"
    scale-type="weeks"
  >

    <DxTasks :data-source="tasks"/>
    <DxDependencies :data-source="dependencies"/>
    <DxResources :data-source="resources"/>
    <DxResourceAssignments :data-source="resourceAssignments"/>

    <DxToolbar>
      <DxItem name="undo"/>
      <DxItem name="redo"/>
      <DxItem name="separator"/>
      <DxItem name="collapseAll"/>
      <DxItem name="expandAll"/>
      <DxItem name="separator"/>
      <DxItem name="addTask"/>
      <DxItem name="deleteTask"/>
      <DxItem name="separator"/>
      <DxItem name="zoomIn"/>
      <DxItem name="zoomOut"/>
    </DxToolbar>

    <DxEditing :enabled="true"/>
    <DxValidation :autoUpdateParentTasks="true"/>

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
  </DxGantt>
</template>
<script>
import {
  DxGantt,
  DxTasks,
  DxDependencies,
  DxResources,
  DxResourceAssignments,
  DxColumn,
  DxEditing,
  DxValidation,
  DxToolbar,
  DxItem
} from 'devextreme-vue/gantt';

import {
  tasks,
  dependencies,
  resources,
  resourceAssignments
} from './data.js';

export default {
  components: {
    DxGantt,
    DxTasks,
    DxDependencies,
    DxResources,
    DxResourceAssignments,
    DxColumn,
    DxEditing,
    DxValidation,
    DxToolbar,
    DxItem
  },
  data() {
    return {
      tasks: tasks,
      dependencies: dependencies,
      resources: resources,
      resourceAssignments: resourceAssignments
    };
  }
};
</script>
<style>
  #gantt {
    height: 700px;
  }
</style>
