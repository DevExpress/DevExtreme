<template>
  <div>
    <div class="master-detail-caption">{{ detailInfo }}</div>
    <DxDataGrid
      :data-source="dataSource"
      :show-borders="true"
      :column-auto-width="true"
    >
      <DxColumn data-field="Subject"/>
      <DxColumn
        data-field="StartDate"
        data-type="date"
      />
      <DxColumn
        data-field="DueDate"
        data-type="date"
      />
      <DxColumn data-field="Priority"/>
      <DxColumn
        :calculate-cell-value="completedValue"
        data-type="boolean"
        caption="Completed"
      />
    </DxDataGrid>
  </div>
</template>
<script setup lang="ts">
import { reactive } from 'vue';
import { DxDataGrid, DxColumn } from 'devextreme-vue/data-grid';
import ArrayStore from 'devextreme/data/array_store';
import DataSource from 'devextreme/data/data_source';
import { MasterDetailTemplateData } from 'devextreme/ui/data_grid';
import { tasks, Task } from './data.ts';

const props = defineProps<{
  templateData: MasterDetailTemplateData
}>();

const dataSource = getTasks(props.templateData.key);

const itemData = reactive(props.templateData.data);
const detailInfo = `${itemData.FirstName} ${itemData.LastName}'s Tasks:`;

const completedValue = (rowData: Task) => rowData.Status === 'Completed';

function getTasks(key: number) {
  return new DataSource({
    store: new ArrayStore({
      data: tasks,
      key: 'ID',
    }),
    filter: ['EmployeeID', '=', key],
  });
}
</script>
<style>
.master-detail-caption {
  padding: 0 0 5px 10px;
  font-size: 14px;
  font-weight: bold;
}
</style>
