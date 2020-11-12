<template>
  <DxDataGrid
    :data-source="tasks"
    :show-borders="true"
    :on-row-inserted="(e) => e.component.navigateToRow(e.key)"
  >
    <DxPaging
      :enabled="true"
      :page-size="15"
    />
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
      :editor-options="editorOptions"
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
          :src="'images/icons/status-' + data.id + '.svg'"
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
        :value="cellInfo.value"
        :on-value-changed="(value) => onValueChanged(value, cellInfo)"
        :data-source="employees"
        :data-grid-component="cellInfo.component"
      />
    </template>

  </DxDataGrid>
</template>
<script>

import {
  DxDataGrid,
  DxPaging,
  DxHeaderFilter,
  DxSearchPanel,
  DxEditing,
  DxColumn,
  DxLookup,
  DxRequiredRule
} from 'devextreme-vue/data-grid';
import { createStore } from 'devextreme-aspnet-data-nojquery';
import { statuses } from './data.js';
import EmployeeDropDownBoxComponent from './EmployeeDropDownBoxComponent.vue';
import EmployeeTagBoxComponent from './EmployeeTagBoxComponent.vue';

const url = 'https://js.devexpress.com/Demos/Mvc/api/CustomEditors';

const employees = createStore({
  key: 'ID',
  loadUrl: `${url }/Employees`,
  onBeforeSend: function(method, ajaxOptions) {
    ajaxOptions.xhrFields = { withCredentials: true };
  }
});

const tasks = createStore({
  key: 'ID',
  loadUrl: `${url}/Tasks`,
  updateUrl: `${url}/UpdateTask`,
  insertUrl: `${url}/InsertTask`,
  onBeforeSend: function(method, ajaxOptions) {
    ajaxOptions.xhrFields = { withCredentials: true };
  }
});

export default {
  components: {
    DxDataGrid,
    DxPaging,
    DxHeaderFilter,
    DxSearchPanel,
    DxEditing,
    DxColumn,
    DxLookup,
    DxRequiredRule,
    EmployeeDropDownBoxComponent,
    EmployeeTagBoxComponent
  },
  data() {
    return {
      tasks: tasks,
      employees: employees,
      statuses: statuses,
      dropDownOptions: { width: 400 },
      editorOptions: { itemTemplate: 'statusTemplate' },
      calculateFilterExpression: function(filterValue, selectedFilterOperation, target) {
        if(target === 'search' && typeof (filterValue) === 'string') {
          return [this.dataField, 'contains', filterValue];
        }
        return function(data) {
          return (data.AssignedEmployee || []).indexOf(filterValue) !== -1;
        };
      }
    };
  },
  methods: {
    cellTemplate(container, options) {
      var noBreakSpace = '\u00A0',
        text = (options.value || []).map(element => {
          return options.column.lookup.calculateCellValue(element);
        }).join(', ');
      container.textContent = text || noBreakSpace;
      container.title = text;
    },
    onValueChanged(value, cellInfo) {
      cellInfo.setValue(value);
      cellInfo.component.updateDimensions();
    }
  }
};
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
