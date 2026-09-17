<template>
  <DxDataGrid
    ref="dataGridRef"
    id="grid-container"
    :dataSource="tasks"
    keyExpr="ID"
    :showBorders="true"
    :filterSyncEnabled="true"
  >
    <DxFilterRow :visible="true"/>
    <DxHeaderFilter :visible="true"/>

    <DxColumn
      dataField="Subject"
      :width="250"
    />
    <DxColumn
      dataField="StartDate"
      dataType="date"
    />
    <DxColumn
      dataField="DueDate"
      dataType="date"
    />
    <DxColumn
      dataField="Priority"
      caption="Priority"
      cellTemplate="priority-cell"
    />
    <template #priority-cell="{ data }">
      <div
        class="priority-badge"
        :style="{ background: priorityColor(data.value) }"
      >{{ data.value }}</div>
    </template>
    <DxColumn
      dataField="Completion"
      caption="Completed"
      alignment="center"
      dataType="boolean"
      :editorOptions="completionEditorOptions"
      :calculateCellValue="calculateCompletionCellValue"
      :calculateFilterExpression="calculateCompletionFilterExpression"
    />
  </DxDataGrid>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { DxDataGrid, DxColumn, DxFilterRow, DxHeaderFilter } from 'devextreme-vue/data-grid';
import { colors, tasks } from './data.ts';
import type { ColumnFilterExpression, Task, TaskPriority } from './types';

const dataGridRef = ref<InstanceType<typeof DxDataGrid>>();

const completionEditorOptions = {
  elementAttr: { 'aria-label': 'Completed' },
};

function priorityColor(value: TaskPriority): string {
  return colors[value];
}

function calculateCompletionCellValue(rowData: Task): boolean {
  return rowData.Completion === 100;
}

function calculateCompletionFilterExpression(
  filterValue: unknown,
  selectedFilterOperation: string | null,
): ColumnFilterExpression {
  const wantsCompleted = selectedFilterOperation === '<>' ? !filterValue : !!filterValue;
  const rawCompletion = (rowData: Task): number => rowData.Completion;

  return wantsCompleted ? [rawCompletion, '=', 100] : [rawCompletion, '<', 100];
}

defineExpose({
  get instance() {
    return dataGridRef.value!.instance;
  },
});
</script>

<style scoped>
#grid-container {
  margin-top: 20px;
  min-height: 360px;
}

.priority-badge {
  border-radius: 24px;
  padding: 2px 8px;
  display: inline-block;
  text-align: center;
}
</style>
