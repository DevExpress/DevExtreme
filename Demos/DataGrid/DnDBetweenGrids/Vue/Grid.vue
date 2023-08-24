<template>
  <DxDataGrid
    :data-source="dataSource"
    :height="440"
    :show-borders="true"
    :filter-value="filterExpr"
  >
    <DxRowDragging
      :data="status"
      :on-add="onAdd"
      group="tasksGroup"
    />
    <DxScrolling mode="virtual"/>
    <DxColumn
      data-field="Subject"
      data-type="string"
    />
    <DxColumn
      :width="80"
      data-field="Priority"
      data-type="number"
    >
      <DxLookup
        :data-source="priorities"
        value-expr="id"
        display-expr="text"
      />
    </DxColumn>
    <DxColumn
      :visible="false"
      data-field="Status"
      data-type="number"
    />

  </DxDataGrid>
</template>

<script setup lang="ts">
import {
  DxDataGrid, DxColumn, DxRowDragging, DxScrolling, DxLookup,
} from 'devextreme-vue/data-grid';
import { RowDraggingAddEvent } from 'devextreme/ui/data_grid';
import CustomStore from 'devextreme/data/custom_store';
import DataSource from 'devextreme/data/data_source';

const props = defineProps<{
  tasksStore: CustomStore
  status: number
}>();

const priorities = [{
  id: 1, text: 'Low',
}, {
  id: 2, text: 'Normal',
}, {
  id: 3, text: 'High',
}, {
  id: 4, text: 'Urgent',
}];

const dataSource = new DataSource({
  store: props.tasksStore,
  reshapeOnPush: true,
});

const filterExpr = ['Status', '=', props.status];

const onAdd = (e: RowDraggingAddEvent) => {
  const key = e.itemData.ID;
  const values = { Status: e.toData };

  dataSource.store().update(key, values).then(() => {
    dataSource.store().push([{
      type: 'update', key, data: values,
    }]);
  });
};
</script>
