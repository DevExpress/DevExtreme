<template>
  <div id="demo-container">
    <DxScrollView id="scroll">
      <DxDraggable
        id="list"
        :group="draggingGroupName"
        :on-drag-start="onListDragStart"
        data="dropArea"
      >
        <DxDraggable
          v-for="task in tasks"
          :key="task.text"
          :clone="true"
          :group="draggingGroupName"
          :data="task"
          :on-drag-start="onItemDragStart"
          :on-drag-end="onItemDragEnd"
          class="item dx-card dx-theme-text-color dx-theme-background-color"
        >
          {{ task.text }}
        </DxDraggable>
      </DxDraggable>
    </DxScrollView>

    <DxScheduler
      time-zone="America/Los_Angeles"
      id="scheduler"
      :data-source="appointments"
      :current-date="currentDate"
      :views="views"
      :height="600"
      :start-day-hour="9"
      :editing="true"
    >
      <DxAppointmentDragging
        :group="draggingGroupName"
        :on-remove="onAppointmentRemove"
        :on-add="onAppointmentAdd"
      />
    </DxScheduler>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import DxScheduler, { DxAppointmentDragging } from 'devextreme-vue/scheduler';
import DxDraggable from 'devextreme-vue/draggable';
import DxScrollView from 'devextreme-vue/scroll-view';
import { appointments as appointmentsData, tasks as tasksData } from './data.js';

const draggingGroupName = ref('appointmentsGroup');
const views = ref([{ type: 'day', intervalCount: 3 }]);
const currentDate = ref(new Date(2021, 3, 26));
const tasks = ref<Array<{text: string}>>(tasksData);
const appointments = ref<Array<{text: string, startDate: Date, endDate: Date}>>(appointmentsData);
function onAppointmentRemove({ itemData }) {
  const index = appointments.value.indexOf(itemData);

  if (index >= 0) {
    appointments.value = [...appointments.value];
    appointments.value.splice(index, 1);
    tasks.value = [...tasks.value, itemData];
  }
}
function onAppointmentAdd(e) {
  const index = tasks.value.indexOf(e.fromData);

  if (index >= 0) {
    tasks.value = [...tasks.value];
    tasks.value.splice(index, 1);
    appointments.value = [...appointments.value, e.itemData];
  }
}
function onListDragStart(e) {
  e.cancel = true;
}
function onItemDragStart(e) {
  e.itemData = e.fromData;
}
function onItemDragEnd(e) {
  if (e.toData) {
    e.cancel = true;
  }
}
</script>
<style>
#scroll,
#list {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 240px;
}

.item {
  box-sizing: border-box;
  padding: 10px 20px;
  margin-bottom: 10px;
}

#scheduler {
  margin-left: 270px;
}

.dx-draggable-source {
  opacity: 0.5;
}

.dx-draggable-dragging > * {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 6px 8px rgba(0, 0, 0, 0.2);
}
</style>
