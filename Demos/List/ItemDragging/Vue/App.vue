<template>
  <div id="list-demo">
    <div class="widget-container">
      <DxList
        :items="plannedTasks"
        :repaint-changes-only="true"
        key-expr="id"
      >
        <DxItemDragging
          :data="plannedTasks"
          :allow-reordering="true"
          :on-drag-start="onDragStart"
          :on-add="onAdd"
          :on-remove="onRemove"
          group="tasks"
        />
      </DxList>
      <DxList
        :items="doingTasks"
        :repaint-changes-only="true"
        key-expr="id"
      >
        <DxItemDragging
          :data="doingTasks"
          :allow-reordering="true"
          :on-drag-start="onDragStart"
          :on-add="onAdd"
          :on-remove="onRemove"
          group="tasks"
        />
      </DxList>
    </div>
  </div>
</template>
<script>

import DxList, { DxItemDragging } from 'devextreme-vue/list';

import { doingTasks, plannedTasks } from './data.js';

export default {
  components: {
    DxList,
    DxItemDragging
  },
  data() {
    return {
      doingTasks,
      plannedTasks
    };
  },
  methods: {
    onDragStart(e) {
      e.itemData = e.fromData[e.fromIndex];
    },
    onAdd(e) {
      e.toData.splice(e.toIndex, 0, e.itemData);
    },
    onRemove(e) {
      e.fromData.splice(e.fromIndex, 1);
    }
  }
};
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
</style>
