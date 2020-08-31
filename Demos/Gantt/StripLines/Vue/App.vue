<template>
  <DxGantt
    :task-list-width="300"
    :height="700"
    task-title-position="none"
  >

    <DxStripLine
      :start="tasks[0].start"
      title="Start"
    />
    <DxStripLine
      :start="tasks[tasks.length - 3].start"
      :end="tasks[tasks.length - 1].end"
      title="Final Phase"
    />
    <DxStripLine
      :start="currentTime"
      title="Current Time"
      css-class="current-time"
    />

    <DxValidation :auto-update-parent-tasks="true"/>

    <DxTasks :data-source="tasks"/>

    <DxColumn
      :width="300"
      data-field="title"
      caption="Task"
    />
  </DxGantt>
</template>
<script>
import {
  DxGantt,
  DxTasks,
  DxColumn,
  DxValidation,
  DxStripLine
} from 'devextreme-vue/gantt';

import {
  tasks
} from './data.js';

export default {
  components: {
    DxGantt,
    DxTasks,
    DxColumn,
    DxValidation,
    DxStripLine
  },
  data() {
    return {
      tasks: tasks,
      currentTime: new Date()
    };
  }
};
</script>
<style>
  .dx-gantt .dx-gantt-tm.current-time {
    border-left: 1px solid red;
  }
</style>
