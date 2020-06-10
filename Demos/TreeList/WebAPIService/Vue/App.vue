<template>
  <div>
    <DxTreeList
      id="tree-list"
      :data-source="tasksData"
      :expanded-row-keys="[1, 2]"
      :show-row-lines="true"
      :show-borders="true"
      :column-auto-width="true"
      :word-wrap-enabled="true"
      key-expr="Task_ID"
      parent-id-expr="Task_Parent_ID"
      has-items-expr="Has_Items"
      @initNewRow="initNewRow($event)"
    >
      <DxRemoteOperations
        :filtering="true"
        :sorting="true"
        :grouping="true"
      />
      <DxSearchPanel :visible="true"/>
      <DxHeaderFilter :visible="true"/>
      <DxEditing
        :allow-adding="true"
        :allow-updating="true"
        :allow-deleting="true"
        mode="row"
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
          :data-source="employeesData"
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
        <DxLookup :data-source="statusesData"/>
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
import {
  DxTreeList,
  DxRemoteOperations,
  DxColumn,
  DxSearchPanel,
  DxHeaderFilter,
  DxEditing,
  DxRequiredRule,
  DxLookup
} from 'devextreme-vue/tree-list';
import AspNetData from 'devextreme-aspnet-data-nojquery';

const url = 'https://js.devexpress.com/Demos/Mvc/api/TreeListTasks';

export default {
  components: {
    DxTreeList,
    DxRemoteOperations,
    DxColumn,
    DxSearchPanel,
    DxHeaderFilter,
    DxEditing,
    DxRequiredRule,
    DxLookup
  },
  data() {
    return {
      tasksData: AspNetData.createStore({
        key: 'Task_ID',
        loadUrl: `${url}/Tasks`,
        insertUrl: `${url}/InsertTask`,
        updateUrl: `${url}/UpdateTask`,
        deleteUrl: `${url}/DeleteTask`,
        onBeforeSend: function(method, ajaxOptions) {
          ajaxOptions.xhrFields = { withCredentials: true };
        }
      }),
      employeesData: AspNetData.createStore({
        key: 'ID',
        loadUrl: `${url}/TaskEmployees`
      }),
      statusesData: [
        'Not Started',
        'Need Assistance',
        'In Progress',
        'Deferred',
        'Completed'
      ]
    };
  },
  methods: {
    initNewRow(e) {
      e.data.Task_Status = 'Not Started';
      e.data.Task_Start_Date = new Date();
      e.data.Task_Due_Date = new Date();
    }
  }
};
</script>
<style scoped>
#tree-list {
  max-height: 640px;
}
</style>
