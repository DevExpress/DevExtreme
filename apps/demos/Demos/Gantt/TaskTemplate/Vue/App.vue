<template>
  <div id="form-demo">
    <div class="widget-container">
      <DxGantt
        :task-list-width="500"
        :height="700"
        scale-type="days"
        task-content-template="taskContentTemplate"
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
<script setup lang="ts">
import {
  DxGantt,
  DxTasks,
  DxDependencies,
  DxResources,
  DxResourceAssignments,
  DxColumn,
  DxEditing,
} from 'devextreme-vue/gantt';
import {
  tasks,
  dependencies,
  resources,
  resourceAssignments,
} from './data.ts';

const getTaskColor = (taskId: number) => `custom-task-color-${taskId % 6}`;
function getImagePath(taskId: number) {
  const img = taskId < 10 ? `0${taskId}` : taskId;
  return `../../../../images/employees/${img}.png`;
}
</script>
<style>
#gantt {
  height: 700px;
}

.custom-task-color-0 {
  background-color: var(--dxds-color-content-utility-purple-default-rest, #512DA8);
}

.custom-task-color-1 {
  background-color: var(--dxds-color-content-utility-green-default-rest, #2E7D32);
}

.custom-task-color-2 {
  background-color: var(--dxds-color-content-utility-blue-default-rest, #1564C0);
}

.custom-task-color-3 {
  background-color: var(--dxds-color-content-utility-pink-default-rest, #C2185B);
}

.custom-task-color-4 {
  background-color: var(--dxds-color-content-utility-red-default-rest, #C62828);
}

.custom-task-color-5 {
  background-color: var(--dxds-color-content-utility-orange-default-rest, #DD2C00);
}

.custom-task-color-6 {
  background-color: var(--dxds-color-content-utility-indigo-default-rest, #7B1FA2);
}

.custom-task {
  max-height: 48px;
  height: 100%;
  display: block;
  overflow: hidden;
}

.custom-task-wrapper {
  padding: 8px;
  color: var(--dxds-color-content-neutral-default-inverted-rest, #fff);
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
  background-color: var(--dxds-color-content-neutral-default-on-surface-rest, #fff);
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
  background: color-mix(in srgb, var(--dxds-color-surface-neutral-default-static-dark-rest, #000) calc(var(--dxds-opacity-30, 0.3) * 100%), transparent);
}

.dx-gantt .dx-row {
  height: 63px;
}
</style>
