<template>
  <div>
    <DxTreeList
      id="tasks"
      :data-source="tasks"
      :auto-expand-all="true"
      :column-auto-width="true"
      :show-borders="true"
      key-expr="Task_ID"
      parent-id-expr="Task_Parent_ID"
    >
      <DxScrolling
        mode="standard"
      />
      <DxPaging
        :enabled="true"
        :page-size="10"
      />
      <DxPager
        :show-page-size-selector="true"
        :allowed-page-sizes="allowedPageSizes"
        :show-info="true"
      />
      <DxColumn
        :width="390"
        data-field="Task_Subject"
      />
      <DxColumn
        data-field="Task_Assigned_Employee_ID"
        caption="Assigned"
      >
        <DxLookup
          :data-source="employees"
          value-expr="ID"
          display-expr="Name"
        />
      </DxColumn>
      <DxColumn
        data-field="Task_Status"
        caption="Status"
      >
        <DxLookup
          :data-source="statuses"
        />
      </DxColumn>
      <DxColumn
        :width="100"
        data-field="Task_Start_Date"
        caption="Start Date"
        data-type="date"
      />
      <DxColumn
        :width="100"
        data-field="Task_Due_Date"
        caption="Due Date"
        data-type="date"
      />
    </DxTreeList>
  </div>
</template>
<script>
import { tasks, employees } from './data.js';
import { DxTreeList, DxScrolling, DxPaging, DxPager, DxColumn, DxLookup } from 'devextreme-vue/tree-list';

export default {
  components: {
    DxTreeList, DxScrolling, DxPaging, DxPager, DxColumn, DxLookup
  },
  data() {
    return {
      tasks: tasks,
      employees: employees,
      allowedPageSizes: [5, 10, 20],
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
