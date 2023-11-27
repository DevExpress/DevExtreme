<template>
  <div>
    <DxGantt
      ref="ganttRef"
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
              :input-attr="{ 'aria-label': 'Format' }"
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
              :input-attr="{ 'aria-label': 'Export Mode' }"
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
              :input-attr="{ 'aria-label': 'Date Range' }"
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
} from './data.ts';

const ganttRef = ref();

const exportButtonOptions = {
  hint: 'Export to PDF',
  icon: 'exportpdf',
  stylingMode: 'text',
  onClick: () => {
    exportGantt();
  },
};
const formatBoxValue = ref(formats[0]);
const exportModeBoxValue = ref(exportModes[0]);
const dateRangeBoxValue = ref(dateRanges[1]);
const landscapeCheckBoxValue = ref(true);
const startTaskIndex = ref(0);
const endTaskIndex = ref(3);
const startDate = ref(tasks[0].start);
const endDate = ref(tasks[0].end);
const customRangeDisabled = ref(true);

async function exportGantt() {
  const format = formatBoxValue.value.toLowerCase();
  const isLandscape = landscapeCheckBoxValue.value;
  const exportMode = exportModeBoxValue.value === 'Tree List' ? 'treeList' : exportModeBoxValue.value.toLowerCase();
  const dataRangeMode = dateRangeBoxValue.value.toLowerCase();
  let dataRange;
  if (dataRangeMode === 'custom') {
    dataRange = {
      startIndex: startTaskIndex.value,
      endIndex: endTaskIndex.value,
      startDate: startDate.value,
      endDate: endDate.value,
    };
  } else {
    dataRange = dataRangeMode;
  }
  const doc = await exportGanttToPdf({
    component: ganttRef.value.instance,
    // eslint-disable-next-line new-cap
    createDocumentMethod: (args) => new jsPDF(args),
    format,
    landscape: isLandscape,
    exportMode,
    dateRange: dataRange,
  });

  doc.save('gantt.pdf');
}
function dateRangeBoxSelectionChanged(e) {
  customRangeDisabled.value = e.value !== 'Custom';
}
function startTaskIndexChanged(e) {
  startTaskIndex.value = e.value;
}
function endTaskIndexChanged(e) {
  endTaskIndex.value = e.value;
}

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
