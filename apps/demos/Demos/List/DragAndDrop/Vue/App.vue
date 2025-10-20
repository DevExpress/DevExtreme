<template>
  <div id="list-demo">
    <div class="widget-container">
      <DxList
        :data-source="plannedTasks"
        key-expr="id"
        :repaint-changes-only="true"
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
        :repaint-changes-only="true"
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
import { ref, type Ref } from 'vue';
import DxList, { DxItemDragging } from 'devextreme-vue/list';
import * as data from './data.ts';

type Task = { id: number, text: string };

const doingTasks = ref<Task[]>(data.doingTasks);
const plannedTasks = ref<Task[]>(data.plannedTasks);
const tasks: Record<string, Ref<Task[]>> = { doingTasks, plannedTasks };
function onDragStart(e: Record<string, any>) {
  e.itemData = tasks[e.fromData].value[e.fromIndex];
}
function onAdd(e: Record<string, any>) {
  const newData = [...tasks[e.toData].value];
  newData.splice(e.toIndex, 0, e.itemData);
  tasks[e.toData].value = newData;
}
function onRemove(e: Record<string, any>) {
  const newData = [...tasks[e.fromData].value];
  newData.splice(e.fromIndex, 1);
  tasks[e.fromData as string].value = newData;
}
function onReorder(e: Record<string, any>) {
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
