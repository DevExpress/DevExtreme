<template>
  <div id="list-demo">
    <div class="widget-container">
      <DxList
        :data-source="plannedTasks"
        key-expr="id"
      >
        <DxItemDragging
          data="plannedTasks"
          :allow-reordering="true"
          :on-drag-start="onDragStart"
          :on-add="onAdd"
          :on-remove="onRemove"
          :on-reorder="onReorder"
          group="tasks"
        />
      </DxList>
      <DxList
        :data-source="doingTasks"
        key-expr="id"
      >
        <DxItemDragging
          data="doingTasks"
          :allow-reordering="true"
          :on-drag-start="onDragStart"
          :on-add="onAdd"
          :on-remove="onRemove"
          :on-reorder="onReorder"
          group="tasks"
        />
      </DxList>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import DxList, { DxItemDragging } from 'devextreme-vue/list';
import * as data from './data.js';

const doingTasks = ref(data.doingTasks);
const plannedTasks = ref(data.plannedTasks);
const tasks = { doingTasks, plannedTasks };
function onDragStart(e) {
  e.itemData = tasks[e.fromData].value[e.fromIndex];
}
function onAdd(e) {
  const newData = [...tasks[e.toData].value];
  newData.splice(e.toIndex, 0, e.itemData);
  tasks[e.toData].value = newData;
}
function onRemove(e) {
  const newData = [...tasks[e.fromData].value];
  newData.splice(e.fromIndex, 1);
  tasks[e.fromData].value = newData;
}
function onReorder(e) {
  onRemove(e);
  onAdd(e);
}
</script>
<style>
.widget-container {
  display: flex;
}

.widget-container > * {
  height: 400px;
  width: 50%;
  padding: 10px;
}

.dx-scrollview-content {
  min-height: 380px;
}

</style>
