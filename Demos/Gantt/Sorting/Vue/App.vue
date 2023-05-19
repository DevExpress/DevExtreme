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
            @value-changed="sortingChanged($event)"
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
<script>
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
} from './data.js';

export default {
  components: {
    DxGantt,
    DxTasks,
    DxDependencies,
    DxResources,
    DxResourceAssignments,
    DxColumn,
    DxEditing,
    DxCheckBox,
    DxSelectBox,
    DxSorting,
  },
  data() {
    return {
      tasks,
      dependencies,
      resources,
      resourceAssignments,
      sortingMode: 'single',
      showSortIndexes: false,
      showSortIndexesDisabled: true,
    };
  },
  methods: {
    sortingChanged() {
      this.showSortIndexesDisabled = this.sortingMode !== 'multiple';
    },
  },
};
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
