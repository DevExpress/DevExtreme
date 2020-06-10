<template>
  <div>
    <DxTreeList
      id="tasks"
      :data-source="tasks"
      :column-auto-width="true"
      :word-wrap-enabled="true"
      :show-borders="true"
      key-expr="Task_ID"
      parent-id-expr="Task_Parent_ID"
    >
      <DxSorting
        mode="multiple"
      />
      <DxColumn
        :min-width="300"
        data-field="Task_Subject"
      />
      <DxColumn
        :min-width="120"
        data-field="Task_Assigned_Employee_ID"
        caption="Assigned"
        sort-order="asc"
      >
        <DxLookup
          :data-source="employees"
          value-expr="ID"
          display-expr="Name"
        />
      </DxColumn>
      <DxColumn
        :min-width="120"
        data-field="Task_Status"
        caption="Status"
        sort-order="asc"
      >
        <DxLookup
          :data-source="statuses"
        />
      </DxColumn>
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
    </DxTreeList>
  </div>
</template>
<script>
import { tasks, employees } from './data.js';
import { DxTreeList, DxSorting, DxColumn, DxLookup } from 'devextreme-vue/tree-list';

export default {
  components: {
    DxTreeList, DxSorting, DxColumn, DxLookup
  },
  data() {
    return {
      tasks: tasks,
      employees: employees,
      statuses: [
        'Not Started',
        'Need Assistance',
        'In Progress',
        'Deferred',
        'Completed'
      ]
    };
  }
};
</script>
<style scoped>
#tasks {
    max-height: 440px;
}
</style>
