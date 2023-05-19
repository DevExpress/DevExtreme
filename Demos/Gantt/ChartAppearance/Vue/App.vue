<template>
  <div id="form-demo">
    <div class="options">
      <div class="caption">Options</div>
      <div class="column">
        <div class="option">
          <div class="label">Scale Type:</div>{{ ' ' }}
          <div class="value">
            <DxSelectBox
              :items="['auto', 'minutes', 'hours', 'days', 'weeks', 'months', 'quarters', 'years']"
              :input-attr="{ 'aria-label': 'Scale Type' }"
              v-model:value="scaleType"
            />
          </div>
        </div>
        <div class="option">
          <div class="label">Title Position:</div>{{ ' ' }}
          <div class="value">
            <DxSelectBox
              :items="['inside', 'outside', 'none']"
              :input-attr="{ 'aria-label': 'Title Position' }"
              v-model:value="taskTitlePosition"
            />
          </div>
        </div>
        <div class="option">
          <div class="label">Show Resources:</div>{{ ' ' }}
          <div class="value">
            <DxCheckBox
              v-model:value="showResources"
            />
          </div>
        </div>
        <div class="option">
          <div class="label">Show Dependencies:</div>{{ ' ' }}
          <div class="value">
            <DxCheckBox
              v-model:value="showDependencies"
            />
          </div>
        </div>
      </div>{{ ' ' }}
      <div class="column">
        <div class="option">
          <div class="label">Start Date Range:</div>{{ ' ' }}
          <div class="value">
            <DxDateBox
              v-model:value="startDateRange"
              :input-attr="{ 'aria-label': 'Start Date' }"
              type="date"
              apply-value-mode="useButtons"
            />
          </div>
        </div>
        <div class="option">
          <div class="label">End Date Range:</div>{{ ' ' }}
          <div class="value">
            <DxDateBox
              v-model:value="endDateRange"
              :input-attr="{ 'aria-label': 'End Date' }"
              type="date"
              apply-value-mode="useButtons"
            />
          </div>
        </div>
        <div class="option">
          <div class="label">Customize Task Tooltip:</div>{{ ' ' }}
          <div class="value">
            <DxCheckBox
              v-model:value="showCustomTaskTooltip"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="widget-container">
      <DxGantt
        :task-list-width="500"
        :height="700"
        :task-title-position="taskTitlePosition"
        :scale-type="scaleType"
        :show-resources="showResources"
        :show-dependencies="showDependencies"
        :start-date-range="startDateRange"
        :end-date-range="endDateRange"
        :task-tooltip-content-template="showCustomTaskTooltip ? 'taskTooltipContentTemplate' : ''"
        :task-progress-tooltip-content-template="showCustomTaskTooltip ? 'taskProgressTooltipContentTemplate' : ''"
        :task-time-tooltip-content-template="showCustomTaskTooltip ? 'taskTimeTooltipContentTemplate' : ''"
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
        />
        <DxColumn
          data-field="start"
          caption="Start Date"
        />
        <DxColumn
          data-field="end"
          caption="End Date"
        />
        <template #taskTooltipContentTemplate="{ data: task }">
          <div class="custom-task-edit-tooltip">
            <div class="custom-tooltip-title">{{ task.title }}</div>
            <div class="custom-tooltip-row"><span>
              Estimate: </span>{{ getTimeEstimate(task) }}<span> hours </span></div>
            <div class="custom-tooltip-row"><span>
              Left: </span>{{ getTimeLeft(task) }}<span> hours </span></div>
          </div>
        </template>
        <template #taskTimeTooltipContentTemplate="{ data: task }">
          <div class="custom-task-edit-tooltip">
            <div class="custom-tooltip-title">Start: {{ getTime(task.start) }}</div>
            <div class="custom-tooltip-title">End: {{ getTime(task.end) }}</div>
          </div></template>
        <template #taskProgressTooltipContentTemplate="{ data: task }">
          <div class="custom-task-edit-tooltip">
            <div class="custom-tooltip-title">{{ task.progress }}%</div>
          </div></template>
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
} from 'devextreme-vue/gantt';
import DxCheckBox from 'devextreme-vue/check-box';
import DxSelectBox from 'devextreme-vue/select-box';
import DxDateBox from 'devextreme-vue/date-box';

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
    DxDateBox,
  },
  data() {
    return {
      tasks,
      dependencies,
      resources,
      resourceAssignments,
      scaleType: 'months',
      taskTitlePosition: 'outside',
      showResources: true,
      showDependencies: true,
      showCustomTaskTooltip: true,
      startDateRange: new Date(2018, 11, 1),
      endDateRange: new Date(2019, 11, 1),
    };
  },
  methods: {
    getTimeEstimate(task) {
      return Math.abs(task.start - task.end) / 36e5;
    },
    getTimeLeft(task) {
      const timeEstimate = Math.abs(task.start - task.end) / 36e5;
      return Math.floor(((100 - task.progress) / 100) * timeEstimate);
    },
    getTime(date) {
      return date.toLocaleString();
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
    background-color: rgba(191, 191, 191, 0.15);
  }

  .caption {
    font-size: 18px;
    font-weight: 500;
  }

  .column {
    width: 40%;
    display: inline-block;
    margin: 15px 3%;
    text-align: left;
    vertical-align: top;
  }

  .option {
    padding: 5px 0;
  }

  .label,
  .value {
    display: inline-block;
    vertical-align: middle;
  }

  .label {
    width: 180px;
  }

  .value {
    width: 45%;
  }

  .custom-task-edit-tooltip {
    background-color: white;
    color: black;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    padding: 10px 12px 12px 12px;
    border-radius: 3px;
  }

  .custom-task-edit-tooltip::before {
    border-top-color: white;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  }

  .custom-task-edit-tooltip::after {
    border-bottom-color: white;
  }

  .custom-tooltip-title {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    font-size: 13px;
    font-weight: 600;
    padding-bottom: 6px;
  }

  .custom-tooltip-row {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    font-size: 12px;
    font-weight: 600;
  }
</style>
