<template>
  <div>
    <DxTreeList
      id="treeList"
      :data-source="dataSource"
      :word-wrap-enabled="true"
      :show-borders="true"
      :focused-row-enabled="true"
      v-model:focused-row-key="focusedRowKey"
      parent-id-expr="Task_Parent_ID"
      has-items-expr="Has_Items"
      @focused-row-changed="onFocusedRowChanged"
    >
      <DxColumn
        data-field="Task_ID"
        width="100"
        alignment="left"
      />
      <DxColumn
        :min-width="120"
        data-field="Task_Assigned_Employee_ID"
        caption="Assigned"
      >
        <DxLookup
          :data-source="taskEmployees"
          value-expr="ID"
          display-expr="Name"
        />
      </DxColumn>
      <DxColumn
        data-field="Task_Status"
        caption="Status"
        width="160"
      />
      <DxColumn
        data-field="Task_Start_Date"
        caption="Start Data"
        data-type="date"
        width="160"
      />
      <DxColumn
        data-field="Task_Due_Date"
        caption="Due Data"
        data-type="date"
        width="160"
      />
    </DxTreeList>

    <div class="task-info">
      <div class="info">
        <div class="task-subject">{{ taskSubject }}</div>
        <span class="task-assigned">{{ taskAssigned }}</span>
        <span class="start-date">{{ startDate }}</span>
      </div>
      <div class="progress">
        <span class="task-status">{{ taskStatus }}</span>
        <span class="task-progress">{{ taskProgress }}</span>
      </div>
    </div>

    <div class="options">
      <div class="caption">Options</div>
      <div class="option">
        <span>Focused row key </span>
        <DxNumberBox
          id="taskId"
          :min="1"
          :max="182"
          :step="0"
          v-model:value="focusedRowKey"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { DxTreeList, DxColumn, DxLookup } from 'devextreme-vue/tree-list';
import DxNumberBox from 'devextreme-vue/number-box';
import * as AspNetData from 'devextreme-aspnet-data-nojquery';

const url = 'https://js.devexpress.com/Demos/Mvc/api/TreeListTasks';

export default {
  components: {
    DxTreeList,
    DxColumn,
    DxLookup,
    DxNumberBox
  },
  data() {
    return {
      taskSubject: '',
      taskAssigned: '',
      startDate: '',
      taskStatus: '',
      taskProgress: '',
      dataSource: AspNetData.createStore({
        key: 'Task_ID',
        loadUrl: `${url }/Tasks`,
        onBeforeSend: function(_, ajaxOptions) {
          ajaxOptions.xhrFields = { withCredentials: true };
        }
      }),
      taskEmployees: AspNetData.createStore({
        key: 'ID',
        loadMode: 'raw',
        loadUrl: `${url}/TaskEmployees`
      }),
      focusedRowKey: 4
    };
  },
  methods: {
    onFocusedRowChanged: function(e) {
      var rowData = e.row && e.row.data,
        cellValue,
        assigned;

      if (rowData) {
        cellValue = e.component.cellValue(e.row.rowIndex, 'Assigned');
        this.taskEmployees.byKey(cellValue).done((item) => {
          assigned = item.Name;
        });

        this.taskSubject = rowData.Task_Subject;
        this.taskAssigned = assigned;
        this.startDate = new Date(rowData.Task_Start_Date).toLocaleDateString();

        this.taskStatus = rowData.Task_Status;
        this.taskProgress = rowData.Task_Completion
          ? `${rowData.Task_Completion }%`
          : '';
      }
    }
  }
};
</script>
