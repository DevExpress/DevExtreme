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
<script>

import DxList, { DxItemDragging } from 'devextreme-vue/list';

import { doingTasks, plannedTasks } from './data.js';

export default {
  components: {
    DxList,
    DxItemDragging,
  },
  data() {
    return {
      doingTasks,
      plannedTasks,
    };
  },
  methods: {
    onDragStart(e) {
      e.itemData = this[e.fromData][e.fromIndex];
    },
    onAdd(e) {
      const data = [...this[e.toData]];
      data.splice(e.toIndex, 0, e.itemData);
      this[e.toData] = data;
    },
    onRemove(e) {
      const data = [...this[e.fromData]];
      data.splice(e.fromIndex, 1);
      this[e.fromData] = data;
    },
    onReorder(e) {
      this.onRemove(e);
      this.onAdd(e);
    },
  },
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

.dx-scrollview-content {
  min-height: 380px;
}

</style>
