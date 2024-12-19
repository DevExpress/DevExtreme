<template>
  <DxDataGrid
    :data-source="tasks"
    :show-borders="true"
    @row-inserted="onRowInserted"
  >
    <DxPaging
      :enabled="true"
      :page-size="15"
    />
    <DxPager :visible="true"/>
    <DxHeaderFilter :visible="true"/>
    <DxSearchPanel :visible="true"/>
    <DxEditing
      :allow-updating="true"
      :allow-adding="true"
      mode="cell"
    />
    <DxColumn
      :width="150"
      :allow-sorting="false"
      data-field="Owner"
      edit-cell-template="dropDownBoxEditor"
    >
      <DxLookup
        :data-source="employees"
        display-expr="FullName"
        value-expr="ID"
      />
      <DxRequiredRule/>
    </DxColumn>
    <DxColumn
      :width="200"
      :allow-sorting="false"
      :cell-template="cellTemplate"
      :calculate-filter-expression="calculateFilterExpression"
      data-field="AssignedEmployee"
      caption="Assignees"
      edit-cell-template="tagBoxEditor"
    >
      <DxLookup
        :data-source="employees"
        value-expr="ID"
        display-expr="FullName"
      />
      <DxRequiredRule/>
    </DxColumn>
    <DxColumn data-field="Subject">
      <DxRequiredRule/>
    </DxColumn>
    <DxColumn
      :editor-options="{ itemTemplate: 'statusTemplate' }"
      data-field="Status"
      width="200"
    >
      <DxLookup
        :data-source="statuses"
        display-expr="name"
        value-expr="id"
      />
      <DxRequiredRule/>
    </DxColumn>
    <template #statusTemplate="{ data }">
      <span v-if="data == null">(All)</span>
      <div v-else>
        <img
          :src="'../../../../images/icons/status-' + data.id + '.svg'"
          class="status-icon middle"
        >
        <span class="middle">{{ data.name }}</span>
      </div>
    </template>

    <template #dropDownBoxEditor="{ data: cellInfo }">
      <EmployeeDropDownBoxComponent
        :value="cellInfo.value"
        :on-value-changed="cellInfo.setValue"
        :data-source="employees"
      />
    </template>

    <template #tagBoxEditor="{ data: cellInfo }">
      <EmployeeTagBoxComponent
        :cell-info="cellInfo"
        :data-source="employees"
        :data-grid-component="cellInfo.component"
      />
    </template>

  </DxDataGrid>
</template>
<script setup lang="ts">
import {
  DxDataGrid,
  DxPaging,
  DxHeaderFilter,
  DxSearchPanel,
  DxEditing,
  DxColumn,
  DxLookup,
  DxRequiredRule,
  DxDataGridTypes,
  DxPager,
} from 'devextreme-vue/data-grid';
import { createStore } from 'devextreme-aspnet-data-nojquery';
import EmployeeDropDownBoxComponent from './EmployeeDropDownBoxComponent.vue';
import EmployeeTagBoxComponent from './EmployeeTagBoxComponent.vue';
import { statuses, Task } from './data.ts';

const url = 'https://js.devexpress.com/Demos/Mvc/api/CustomEditors';

const employees = createStore({
  key: 'ID',
  loadUrl: `${url}/Employees`,
  onBeforeSend(method, ajaxOptions) {
    ajaxOptions.xhrFields = { withCredentials: true };
  },
});

const tasks = createStore({
  key: 'ID',
  loadUrl: `${url}/Tasks`,
  updateUrl: `${url}/UpdateTask`,
  insertUrl: `${url}/InsertTask`,
  onBeforeSend(method, ajaxOptions) {
    ajaxOptions.xhrFields = { withCredentials: true };
  },
});

const cellTemplate = (container: HTMLElement, options: DxDataGridTypes.ColumnCellTemplateData) => {
  const noBreakSpace = '\u00A0';

  const assignees = (options.value || []).map(
    (assigneeId: number) => options.column!.lookup!.calculateCellValue!(assigneeId),
  );
  const text = assignees.join(', ');

  container.textContent = text || noBreakSpace;
  container.title = text;
};

const onRowInserted = (e: DxDataGridTypes.RowInsertedEvent) => {
  e.component.navigateToRow(e.key);
};

function calculateFilterExpression(
  this: DxDataGridTypes.Column,
  filterValue: any,
  selectedFilterOperations: string | null,
  target: string,
) {
  if (target === 'search' && typeof filterValue === 'string') {
    return [this.dataField, 'contains', filterValue];
  }

  return (rowData: Task) => (rowData.AssignedEmployee || []).includes(filterValue);
}
</script>
<style>
  .status-icon {
    height: 16px;
    width: 16px;
    display: inline-block;
    margin-right: 8px;
  }

  .middle {
    vertical-align: middle;
  }
</style>
