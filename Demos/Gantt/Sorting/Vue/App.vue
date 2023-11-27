<template>
  <div id="form-demo">
    <div class="options">
      <div class="caption">Options</div>
      <div class="option">
        <div class="label">Sorting Mode:</div>{{ ' ' }}
        <div class="value">
          <DxSelectBox
            :items="['single', 'multiple', 'none']"
            v-model:value="sortingMode"
            :input-attr="{ 'aria-label': 'Sorting Mode' }"
            @value-changed="sortingChanged()"
          />
        </div>
      </div>
      <div class="option">
        <DxCheckBox
          v-model:value="showSortIndexes"
          :disabled="showSortIndexesDisabled"
          text="Show Sort Indexes"
        />
      </div>
    </div>
    <div class="widget-container">
      <DxGantt
        :task-list-width="500"
        :height="700"
        scale-type="weeks"
        :root-value="-1"
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
          sort-order="asc"
        />
        <DxColumn
          data-field="start"
          caption="Start Date"
        />
        <DxColumn
          data-field="end"
          caption="End Date"
        />
        <DxSorting
          :mode="sortingMode"
          :show-sort-indexes="showSortIndexes"
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
  DxSorting,
} from 'devextreme-vue/gantt';
import DxCheckBox from 'devextreme-vue/check-box';
import DxSelectBox from 'devextreme-vue/select-box';
import {
  tasks,
  dependencies,
  resources,
  resourceAssignments,
} from './data.ts';

const sortingMode = ref('single');
const showSortIndexes = ref(false);
const showSortIndexesDisabled = ref(true);

function sortingChanged() {
  showSortIndexesDisabled.value = sortingMode.value !== 'multiple';
}
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
