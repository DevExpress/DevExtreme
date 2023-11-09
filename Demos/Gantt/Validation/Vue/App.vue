<template>
  <div id="form-demo">
    <div class="options">
      <div class="caption">Options</div>
      <div class="option">
        <DxCheckBox
          v-model:value="autoUpdateParentTasks"
          text="Auto Update Parent Tasks"
        />
      </div>
      <div class="option">
        <DxCheckBox
          v-model:value="validateDependencies"
          text="Enable Dependency Validation"
        />
      </div>
      <div class="option">
        <DxCheckBox
          v-model:value="enablePredecessorGap"
          text="Enable Predecessor Gap"
        />
      </div>
    </div>
    <div class="widget-container">
      <DxGantt
        :task-list-width="500"
        :height="700"
        task-title-position="none"
      >

        <DxValidation
          :auto-update-parent-tasks="autoUpdateParentTasks"
          :validate-dependencies="validateDependencies"
          :enable-predecessor-gap="enablePredecessorGap"
        />

        <DxTasks :data-source="tasks"/>
        <DxDependencies :data-source="dependencies"/>

        <DxEditing :enabled="true"/>

        <DxColumn
          :width="300"
          data-field="title"
          caption="Task"
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
  DxColumn,
  DxEditing,
  DxValidation,
} from 'devextreme-vue/gantt';
import DxCheckBox from 'devextreme-vue/check-box';
import {
  tasks,
  dependencies,
} from './data.js';

const autoUpdateParentTasks = ref(true);
const validateDependencies = ref(true);
const enablePredecessorGap = ref(true);
</script>
<style>
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
