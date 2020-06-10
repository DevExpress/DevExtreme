<template>
  <DxTreeList
    id="tasks"
    :data-source="dataSource"
    :show-borders="true"
    :column-auto-width="true"
    :word-wrap-enabled="true"
    :expanded-row-keys="expandedRowKeys"
    :selected-row-keys="selectedRowKeys"
    key-expr="Task_ID"
    parent-id-expr="Task_Parent_ID"
  >

    <DxSearchPanel
      :visible="true"
      :width="250"
    />
    <DxHeaderFilter :visible="true"/>
    <DxSelection mode="multiple"/>
    <DxColumnChooser :enabled="true"/>

    <DxColumn
      :width="300"
      data-field="Task_Subject"
    />
    <DxColumn
      :allow-sorting="true"
      :min-width="200"
      data-field="Task_Assigned_Employee_ID"
      caption="Assigned"
      cell-template="employeeTemplate"
    >
      <DxLookup
        :data-source="employees"
        value-expr="ID"
        display-expr="Name"
      />
    </DxColumn>
    <DxColumn
      :min-width="100"
      data-field="Task_Status"
      caption="Status"
    >
      <DxLookup :data-source="statuses"/>
    </DxColumn>
    <DxColumn
      :visible="false"
      data-field="Task_Priority"
      caption="Priority"
    >
      <DxLookup
        :data-source="priorities"
        value-expr="id"
        display-expr="value"
      />
    </DxColumn>
    <DxColumn
      :min-width="100"
      :customize-text="customizeTaskCompletionText"
      :visible="false"
      data-field="Task_Completion"
      caption="% Completed"
    />
    <DxColumn
      data-field="Task_Start_Date"
      caption="Start Date"
      data-type="date"
    />
    <DxColumn
      data-field="Task_Due_Date"
      caption="Due Date"
      data-type="date"
    />
    <template #employeeTemplate="{ data: options }">
      <EmployeeCell
        :cell-data="options.data"
      />
    </template>
  </DxTreeList>
</template>
<script>

import {
  DxTreeList,
  DxColumn,
  DxColumnChooser,
  DxHeaderFilter,
  DxSearchPanel,
  DxSelection,
  DxLookup
} from 'devextreme-vue/tree-list';

import { tasks, employees, priorities } from './data.js';
import EmployeeCell from './EmployeeCell.vue';

const statuses = [
  'Not Started',
  'Need Assistance',
  'In Progress',
  'Deferred',
  'Completed'
];

export default {
  components: {
    DxTreeList,
    DxColumn,
    DxColumnChooser,
    DxHeaderFilter,
    DxSearchPanel,
    DxSelection,
    DxLookup,
    EmployeeCell
  },
  data() {
    return {
      expandedRowKeys: [1, 2],
      selectedRowKeys: [1, 29, 42],
      employees,
      priorities,
      statuses
    };
  },
  computed: {
    dataSource() {
      return tasks.map(function(task) {
        employees.forEach(function(employee) {
          if (task.Task_Assigned_Employee_ID === employee.ID) {
            task.Task_Assigned_Employee = employee;
          }
        });
        return task;
      });
    }
  },
  methods: {
    customizeTaskCompletionText(cellInfo) {
      return `${cellInfo.valueText}%`;
    }
  },
};
</script>
<style>
#tasks {
    max-height: 540px;
}
#tasks .dx-treelist-rowsview td {
    vertical-align: middle;
}
</style>
