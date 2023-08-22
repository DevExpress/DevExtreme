<template>
  <div>
    <DxDataGrid
      :data-source="tasks"
      key-expr="ID"
      :show-borders="true"
      :height="440"
    >
      <DxRowDragging
        :allow-reordering="true"
        :on-reorder="onReorder"
        :show-drag-icons="showDragIcons"
      />
      <DxSorting mode="none"/>
      <DxScrolling mode="virtual"/>
      <DxColumn
        :width="55"
        data-field="ID"
      />
      <DxColumn
        :width="150"
        data-field="Owner"
      >
        <DxLookup
          :data-source="employees"
          value-expr="ID"
          display-expr="FullName"
        />
      </DxColumn>
      <DxColumn
        :width="150"
        data-field="AssignedEmployee"
        caption="Assignee"
      >
        <DxLookup
          :data-source="employees"
          value-expr="ID"
          display-expr="FullName"
        />
      </DxColumn>
      <DxColumn data-field="Subject"/>
    </DxDataGrid>

    <div class="options">
      <div class="caption">Options</div>
      <div class="option">
        <DxCheckBox
          v-model:value="showDragIcons"
          text="Show Drag Icons"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import {
  DxDataGrid, DxColumn, DxLookup, DxScrolling, DxRowDragging, DxSorting,
} from 'devextreme-vue/data-grid';
import DxCheckBox from 'devextreme-vue/check-box';
import { tasks as defaultTasks, employees } from './data.js';

const showDragIcons = ref(true);

const tasks = ref(defaultTasks);

const onReorder = (e) => {
  const visibleRows = e.component.getVisibleRows();
  const toIndex = tasks.value.findIndex((item) => item.ID === visibleRows[e.toIndex].data.ID);
  const fromIndex = tasks.value.findIndex((item) => item.ID === e.itemData.ID);
  const newTasks = [...tasks.value];

  newTasks.splice(fromIndex, 1);
  newTasks.splice(toIndex, 0, e.itemData);

  tasks.value = newTasks;
};
</script>
<style>
  .options {
    padding: 20px;
    background-color: rgba(191, 191, 191, 0.15);
    margin-top: 20px;
  }

  .caption {
    font-size: 18px;
    font-weight: 500;
  }

  .option {
    width: 24%;
    display: inline-block;
    margin-top: 10px;
  }
</style>
