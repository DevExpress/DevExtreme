<template>
  <div id="grid-container">
    <DxDataGrid
      ref="dataGridRef"
      :data-source="tasks"
      key-expr="ID"
      :show-borders="true"
      :filter-sync-enabled="true"
    >
      <DxFilterRow :visible="true"/>
      <DxHeaderFilter :visible="true"/>

      <DxColumn
        data-field="Subject"
        :width="250"
      />
      <DxColumn
        data-field="StartDate"
        data-type="date"
      />
      <DxColumn
        data-field="DueDate"
        data-type="date"
      />
      <DxColumn
        data-field="Priority"
        caption="Priority"
        cell-template="priority-cell"
      />
      <template #priority-cell="{ data }">
        <div
          :class="['priority-badge', `priority-badge--${data.value.toLowerCase()}`]"
        >{{ data.value }}</div>
      </template>
      <DxColumn
        data-field="Completion"
        caption="Completed"
        alignment="center"
        data-type="boolean"
        :editor-options="completionEditorOptions"
        :calculate-cell-value="calculateCompletionCellValue"
        :calculate-filter-expression="calculateCompletionFilterExpression"
      />
    </DxDataGrid>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { DxDataGrid, DxColumn, DxFilterRow, DxHeaderFilter } from 'devextreme-vue/data-grid';
import { tasks } from './data.ts';
import type { ColumnFilterExpression, Task } from './data.ts';

const dataGridRef = ref<InstanceType<typeof DxDataGrid>>();

const completionEditorOptions = {
  elementAttr: { 'aria-label': 'Completed' },
};

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

<style>
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

.priority-badge--high {
  background: #f1bbbc;
}

.priority-badge--normal {
  background: #f9e2ae;
}

.priority-badge--low {
  background: #9fd89f;
}
</style>
