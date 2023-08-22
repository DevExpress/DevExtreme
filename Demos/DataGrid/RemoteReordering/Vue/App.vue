<template>
  <DxDataGrid
    :data-source="tasksStore"
    :show-borders="true"
    :height="440"
  >
    <DxRowDragging
      :allow-reordering="true"
      :on-reorder="onReorder"
      drop-feedback-mode="push"
    />
    <DxSorting mode="none"/>
    <DxScrolling mode="virtual"/>
    <DxColumn
      :width="55"
      data-field="ID"
    />
    <DxColumn
      :width="150"
      data-field="Owner"
    >
      <DxLookup
        :data-source="employeesStore"
        value-expr="ID"
        display-expr="FullName"
      />
    </DxColumn>
    <DxColumn
      :width="150"
      data-field="AssignedEmployee"
      caption="Assignee"
    >
      <DxLookup
        :data-source="employeesStore"
        value-expr="ID"
        display-expr="FullName"
      />
    </DxColumn>
    <DxColumn data-field="Subject"/>
  </DxDataGrid>
</template>
<script setup lang="ts">
import {
  DxDataGrid, DxColumn, DxLookup, DxScrolling, DxRowDragging, DxSorting,
} from 'devextreme-vue/data-grid';
import { createStore } from 'devextreme-aspnet-data-nojquery';

const url = 'https://js.devexpress.com/Demos/Mvc/api/RowReordering';

const tasksStore = createStore({
  key: 'ID',
  loadUrl: `${url}/Tasks`,
  updateUrl: `${url}/UpdateTask`,
  onBeforeSend: (method, ajaxOptions) => {
    ajaxOptions.xhrFields = { withCredentials: true };
  },
});

const employeesStore = createStore({
  key: 'ID',
  loadUrl: `${url}/Employees`,
  onBeforeSend: (method, ajaxOptions) => {
    ajaxOptions.xhrFields = { withCredentials: true };
  },
});

const onReorder = (e) => {
  e.promise = processReorder(e);
};

const processReorder = async(e) => {
  const visibleRows = e.component.getVisibleRows();
  const newOrderIndex = visibleRows[e.toIndex].data.OrderIndex;

  await tasksStore.update(e.itemData.ID, { OrderIndex: newOrderIndex });
  await e.component.refresh();
};

</script>
