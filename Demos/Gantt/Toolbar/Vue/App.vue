<template>
  <div>
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
        <DxItem name="separator"/>
        <DxItem
          :options="aboutButtonOptions"
          widget="dxButton"
        />
      </DxToolbar>

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
    </DxGantt>
    <DxPopup
      v-model:visible="popupVisible"
      title="About"
      :height="auto"
      :show-title="true"
      :close-on-outside-click="true"
    >
      <div>
        The DevExtreme HTML5 JavaScript <b>Gantt</b> allows you to display the task flow and dependencies between tasks over a certain period.
        <br>
        <br>
        You can move and modify tasks (a task name, duration or progress, for example) directly from the chart.
        Adjust the timescale to display tasks in smaller or greater time intervals, from hours to years.
        Hold the CTRL key and rotate your mouse's scroll wheel to zoom (in or out) to browse data across various levels of detail.
      </div>
    </DxPopup>
  </div>
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
  DxToolbar,
  DxItem
} from 'devextreme-vue/gantt';
import { DxPopup } from 'devextreme-vue/popup';

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
    DxToolbar,
    DxItem,
    DxPopup
  },
  data() {
    return {
      tasks: tasks,
      dependencies: dependencies,
      resources: resources,
      resourceAssignments: resourceAssignments,
      popupVisible: false,
      aboutButtonOptions: {
        text: 'About',
        icon: 'info',
        stylingMode: 'text',
        onClick: () => {
          this.popupVisible = true;
        }
      }
    };
  }
};
</script>
<style>
  #gantt {
    height: 700px;
  }
</style>
