<template>
  <div id="form-demo">
    <div class="widget-container">
      <DxGantt
        :task-list-width="300"
        :height="700"
        scale-type="days"
        :task-content-template="taskContentTemplate"
      >

        <DxTasks :data-source="tasks"/>
        <DxDependencies :data-source="dependencies"/>
        <DxResources :data-source="resources"/>
        <DxResourceAssignments :data-source="resourceAssignments"/>

        <DxEditing :enabled="false"/>

        <DxColumn
          :width="200"
          data-field="title"
          caption="Subject"
        />
        <DxColumn
          :width="50"
          data-field="start"
          caption="Start Date"
        />
        <DxColumn
          :width="50"
          data-field="end"
          caption="End Date"
        />
        <template #taskContentTemplate="{ data: item }">
          <div
            class="custom-task"
            :class="getTaskColor(item.taskData.id)"
            :style="{width: item.taskSize.width + 'px'}"
          >
            <div class="custom-task-img-wrapper">
              <img
                class="custom-task-img"
                :src="getImagePath(item.taskData.id)"
              >
            </div>
            <div class="custom-task-wrapper">
              <div class="custom-task-title">{{ item.taskData.title }}</div>
              <div class="custom-task-row">{{ item.taskResources[0].text }}</div>
            </div>
            <div
              class="custom-task-progress"
              :style="{width: item.taskData.progress + '%'}"
            />
          </div>
        </template>
      </DxGantt>
    </div>
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
  DxEditing
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
    DxEditing
  },
  data() {
    return {
      tasks: tasks,
      dependencies: dependencies,
      resources: resources,
      resourceAssignments: resourceAssignments,
    };
  },
  methods: {
    getImagePath(taskId) {
      const imgPath = '../../../../images/employees';
      let img = taskId < 10 ? `0${taskId}` : taskId;
      img = `${imgPath}/${img}.png`;
      return img;
    },
    getTaskColor(taskId) {
      const color = taskId % 6;
      return `custom-task-color-${color}`;
    }
  }
};
</script>
<style>
  #gantt {
    height: 700px;
}

.custom-task-color-0 {
    background-color: #5C57C9;
}

.custom-task-color-1 {
    background-color: #35B86B;
}

.custom-task-color-2 {
    background-color: #4796CE;
}

.custom-task-color-3 {
    background-color: #CE4776;
}

.custom-task-color-4 {
    background-color: #CE5B47;
}

.custom-task-color-5 {
    background-color: #F78119;
}

.custom-task-color-6 {
    background-color: #9F47CE;
}

.custom-task {
    max-height: 48px;
    height: 100%;
    display: block;
    overflow: hidden;
}

.custom-task-wrapper {
    padding: 8px;
    color: #fff;
}

.custom-task-wrapper > * {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
}

.custom-task-img-wrapper {
    float: left;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    margin: 8px;
    background-color: #fff;
    overflow: hidden;
}
.custom-task-img {
    width: 32px;
}

.custom-task-title {
    font-weight: 600;
    font-size: 13px;
}

.custom-task-row {
    font-size: 11px;
}

.custom-task-progress {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 0%;
    height: 4px;
    background: rgba(0, 0, 0, .3);
}

.dx-gantt .dx-row {
    height: 63px;
}
</style>
