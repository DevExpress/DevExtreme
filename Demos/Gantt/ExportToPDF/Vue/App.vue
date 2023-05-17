<template>
  <div>
    <DxGantt
      :ref="ganttRef"
      :task-list-width="500"
      :height="700"
      scale-type="weeks"
      :root-value="-1"
    >

      <DxTasks :data-source="tasks"/>
      <DxDependencies :data-source="dependencies"/>
      <DxResources :data-source="resources"/>
      <DxResourceAssignments :data-source="resourceAssignments"/>

      <DxToolbar>
        <DxItem name="undo"/>
        <DxItem name="redo"/>
        <DxItem name="separator"/>
        <DxItem name="zoomIn"/>
        <DxItem name="zoomOut"/>
        <DxItem name="separator"/>
        <DxItem
          :options="exportButtonOptions"
          widget="dxButton"
        />
      </DxToolbar>

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
    <div class="options">
      <div class="column">
        <div class="caption">Export Options</div>
        <div class="option">
          <div class="label">Document format:
          </div>
          <div class="value">
            <DxSelectBox
              :items="formats"
              v-model:value="formatBoxValue"
            />
          </div>
        </div>
        <div class="option">
          <div class="label">Landscape orientation:</div>
          <div class="value">
            <DxCheckBox v-model:value="landscapeCheckBoxValue"/>
          </div>
        </div>
        <div class="option">
          <div class="label">Export mode:</div>
          <div class="value">
            <DxSelectBox
              :items="exportModes"
              v-model:value="exportModeBoxValue"
            />
          </div>
        </div>
        <div class="option">
          <div class="label">Date range:</div>
          <div class="value">
            <DxSelectBox
              :items="dateRanges"
              v-model:value="dateRangeBoxValue"
              @value-changed="dateRangeBoxSelectionChanged($event)"
            />
          </div>
        </div>
      </div>
      <div class="column">
        <div class="caption">Task Filter Options</div>
        <div class="option">
          <div class="label">Start task (index):</div>
          <div class="value">
            <DxNumberBox
              :disabled="customRangeDisabled"
              :value="startTaskIndex"
              :min="0"
              :max="endTaskIndex"
              :show-spin-buttons="true"
              :input-attr="{ 'aria-label': 'Start Task Index' }"
              @value-changed="startTaskIndexChanged"
            />
          </div>
        </div>
        <div class="option">
          <div class="label">End task (index):</div>
          <div class="value">
            <DxNumberBox
              :disabled="customRangeDisabled"
              :value="endTaskIndex"
              :min="startTaskIndex"
              :max="tasks.length - 1"
              :show-spin-buttons="true"
              :input-attr="{ 'aria-label': 'End Task Index' }"
              @value-changed="endTaskIndexChanged"
            />
          </div>
        </div>
        <div class="option">
          <div class="label">Start date:</div>
          <div class="value">
            <DxDateBox
              :disabled="customRangeDisabled"
              :input-attr="{ 'aria-label': 'Start Date' }"
              v-model:value="startDate"
              :max="endDate"
              type="date"
              apply-value-mode="useButtons"
            />
          </div>
        </div>
        <div class="option">
          <div class="label">End date:</div>
          <div class="value">
            <DxDateBox
              :disabled="customRangeDisabled"
              :input-attr="{ 'aria-label': 'End Date' }"
              v-model:value="endDate"
              :min="startDate"
              type="date"
              apply-value-mode="useButtons"
            />
          </div>
        </div>
      </div>
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
  DxToolbar,
  DxItem,
} from 'devextreme-vue/gantt';

import DxCheckBox from 'devextreme-vue/check-box';
import DxNumberBox from 'devextreme-vue/number-box';
import DxDateBox from 'devextreme-vue/date-box';
import DxSelectBox from 'devextreme-vue/select-box';

import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { exportGantt as exportGanttToPdf } from 'devextreme/pdf_exporter';

import {
  tasks,
  dependencies,
  resources,
  resourceAssignments,
  formats,
  exportModes,
  dateRanges,
} from './data.js';

const ganttRef = 'gantt';

export default {
  components: {
    DxGantt,
    DxTasks,
    DxDependencies,
    DxResources,
    DxResourceAssignments,
    DxColumn,
    DxEditing,
    DxToolbar,
    DxItem,
    DxCheckBox,
    DxNumberBox,
    DxDateBox,
    DxSelectBox,
  },
  data() {
    return {
      ganttRef,
      tasks,
      dependencies,
      resources,
      resourceAssignments,
      exportButtonOptions: {
        hint: 'Export to PDF',
        icon: 'exportpdf',
        stylingMode: 'text',
        onClick: () => {
          this.exportGantt();
        },
      },
      formats,
      exportModes,
      dateRanges,

      dateRangeBoxRefName: 'date-range-box',

      formatBoxValue: null,
      exportModeBoxValue: null,
      dateRangeBoxValue: null,
      landscapeCheckBoxValue: true,

      startTaskIndex: 0,
      endTaskIndex: 3,
      startDate: null,
      endDate: null,

      customRangeDisabled: true,
    };
  },
  computed: {
    gantt() {
      return this.$refs[ganttRef].instance;
    },
  },
  created() {
    this.formatBoxValue = formats[0];
    this.exportModeBoxValue = exportModes[0];
    this.dateRangeBoxValue = dateRanges[1];
    this.startDate = tasks[0].start;
    this.endDate = tasks[0].end;
  },
  methods: {
    exportGantt() {
      const format = this.formatBoxValue.toLowerCase();
      const isLandscape = this.landscapeCheckBoxValue;
      const exportMode = this.exportModeBoxValue === 'Tree List' ? 'treeList' : this.exportModeBoxValue.toLowerCase();
      const dataRangeMode = this.dateRangeBoxValue.toLowerCase();
      let dataRange;
      if (dataRangeMode === 'custom') {
        dataRange = {
          startIndex: this.startTaskIndex,
          endIndex: this.endTaskIndex,
          startDate: this.startDate,
          endDate: this.endDate,
        };
      } else {
        dataRange = dataRangeMode;
      }
      exportGanttToPdf({
        component: this.gantt,
        // eslint-disable-next-line new-cap
        createDocumentMethod: (args) => new jsPDF(args),
        format,
        landscape: isLandscape,
        exportMode,
        dateRange: dataRange,
      }).then((doc) => doc.save('gantt.pdf'));
    },
    dateRangeBoxSelectionChanged(e) {
      this.customRangeDisabled = e.value !== 'Custom';
    },
    startTaskIndexChanged(e) {
      this.startTaskIndex = e.value;
    },
    endTaskIndexChanged(e) {
      this.endTaskIndex = e.value;
    },
  },
};
</script>
<style>
  #gantt {
    height: 700px;
  }

  .options {
    background-color: rgba(191, 191, 191, 0.15);
    margin-top: 20px;
    display: flex;
  }

  .column {
    width: 40%;
    display: flex;
    flex-direction: column;
    margin: 15px 3%;
    text-align: left;
  }

  .option {
    padding: 5px 0;
    display: flex;
    align-items: center;
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
    width: 30%;
  }

  .caption {
    font-size: 18px;
    font-weight: 500;
  }
</style>
