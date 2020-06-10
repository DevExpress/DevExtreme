<template>
  <div>
    <div id="tree-list-demo">
      <DxTreeList
        id="tasks"
        :data-source="tasks"
        :column-auto-width="true"
        :word-wrap-enabled="true"
        :show-borders="true"
        key-expr="Task_ID"
        parent-id-expr="Task_Parent_ID"
        @init-new-row="onInitNewRow"
      >
        <DxEditing
          :allow-adding="true"
          :allow-updating="true"
          :allow-deleting="true"
          mode="cell"
        />
        <DxColumn
          :min-width="250"
          data-field="Task_Subject"
        >
          <DxRequiredRule/>
        </DxColumn>
        <DxColumn
          :min-width="120"
          data-field="Task_Assigned_Employee_ID"
          caption="Assigned"
        >
          <DxLookup
            :data-source="employees"
            value-expr="ID"
            display-expr="Name"
          />
          <DxRequiredRule/>
        </DxColumn>
        <DxColumn
          :min-width="120"
          data-field="Task_Status"
          caption="Status"
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
  </div>
</template>
<script>
import { tasks, employees } from './data.js';
import { DxTreeList, DxEditing, DxColumn, DxRequiredRule, DxLookup } from 'devextreme-vue/tree-list';

export default {
  components: {
    DxTreeList, DxEditing, DxColumn, DxRequiredRule, DxLookup
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
  },
  methods: {
    onInitNewRow(e) {
      e.data.Task_Status = 'Not Started';
      e.data.Task_Start_Date = new Date();
      e.data.Task_Due_Date = new Date();
    }
  }
};
</script>
<style scoped>
#tree-list-demo {
    min-height: 700px;
}

#tasks {
    max-height: 700px;
}
</style>
