<template>
  <div id="form-demo">
    <div class="options">
      <div class="caption">Options</div>
      <div class="option">
        <DxCheckBox
          :value="disableContextMenu"
          text="Prevent Context Menu Showing"
          @value-changed="onPreventContextMenuShowing"
        />
      </div>
      <div class="option">
        <DxCheckBox
          :value="true"
          text="Customize Context Menu"
          @value-changed="onCustomizeContextMenu"
        />
      </div>
    </div>
    <div class="widget-container">
      <DxGantt
        :task-list-width="500"
        :height="700"
        scale-type="weeks"
        :show-resources="showResources"
        :on-custom-command="onCustomCommandClick"
        :on-context-menu-preparing="onContextMenuPreparing"
      >
        <DxContextMenu
          :items="contextMenuActualItems"
        />

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
      </DxGantt>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import {
  DxGantt,
  DxTasks,
  DxDependencies,
  DxResources,
  DxResourceAssignments,
  DxColumn,
  DxEditing,
  DxContextMenu,
} from 'devextreme-vue/gantt';
import DxCheckBox from 'devextreme-vue/check-box';
import {
  tasks,
  dependencies,
  resources,
  resourceAssignments,
} from './data.js';

const showResources = ref(true);
const disableContextMenu = ref(false);
const contextMenuItems = [
  'addTask',
  'taskdetails',
  'deleteTask',
  {
    name: 'ToggleDisplayOfResources',
    text: 'Toggle Display of Resources',
  },
];
const contextMenuActualItems = ref(contextMenuItems);

function onContextMenuPreparing(e) {
  e.cancel = disableContextMenu.value;
}
function onCustomizeContextMenu(e) {
  contextMenuActualItems.value = e.value ? contextMenuItems : null;
}
function onPreventContextMenuShowing(e) {
  disableContextMenu.value = e.value;
}
function onCustomCommandClick(e) {
  if (e.name === 'ToggleDisplayOfResources') {
    showResources.value = !showResources.value;
  }
}
</script>
<style>
  #gantt {
    height: 700px;
  }

  .options {
    margin-bottom: 20px;
    padding: 20px;
    background-color: rgba(191, 191, 191, 0.15);
    position: relative;
  }

  .caption {
    font-size: 18px;
    font-weight: 500;
  }

  .option {
    margin-top: 10px;
    margin-right: 44px;
    display: inline-block;
  }

  .option:last-child {
    margin-right: 0;
  }
</style>
