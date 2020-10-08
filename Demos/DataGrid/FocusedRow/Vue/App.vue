<template>
  <div>
    <DxDataGrid
      id="gridContainer"
      :ref="dataGridRefName"
      :data-source="dataSource"
      :columns="columns"
      :show-borders="true"
      :focused-row-enabled="true"
      :auto-navigate-to-focused-row="autoNavigateToFocusedRow"
      v-model:focused-row-key="focusedRowKey"
      @focused-row-changing="onFocusedRowChanging"
      @focused-row-changed="onFocusedRowChanged"
    >
      <DxPaging :page-size="10"/>
    </DxDataGrid>

    <div class="task-info">
      <div class="info">
        <div id="taskSubject">{{ taskSubject }}</div>
        <p
          id="taskDetails"
          v-html="taskDetails"
        />
      </div>
      <div class="progress">
        <span id="taskStatus">{{ taskStatus }}</span>
        <span id="taskProgress">{{ taskProgress }}</span>
      </div>
    </div>

    <div class="options">
      <div class="caption">Options</div>
      <div class="option">
        <span>Focused Row Key </span>
        <DxNumberBox
          id="taskId"
          :ref="taskIdEditorRefName"
          :min="1"
          :max="183"
          :step="0"
          v-model:value="focusedRowKey"
        />
      </div>
      <div class="option">
        <DxCheckBox
          :text="'Auto Navigate To Focused Row'"
          v-model:value="autoNavigateToFocusedRow"
        />
      </div>
    </div>
  </div>
</template>

<script>

import 'devextreme/data/odata/store';

import { DxDataGrid, DxPager, DxPaging } from 'devextreme-vue/data-grid';
import DxNumberBox from 'devextreme-vue/number-box';
import DxCheckBox from 'devextreme-vue/check-box';

const dataGridRefName = 'dataGrid';
const taskIdEditorRefName = 'taskIdEditor';

export default {
  components: {
    DxDataGrid,
    DxPager,
    DxPaging,
    DxNumberBox,
    DxCheckBox
  },
  data() {
    return {
      taskIdEditorRefName: taskIdEditorRefName,
      dataGridRefName: dataGridRefName,
      taskSubject: '',
      taskDetails: '',
      taskStatus: '',
      taskProgress: '',
      dataSource: {
        store: {
          type: 'odata',
          key: 'Task_ID',
          url: 'https://js.devexpress.com/Demos/DevAV/odata/Tasks'
        },
        expand: 'ResponsibleEmployee',
        select: [
          'Task_ID',
          'Task_Subject',
          'Task_Start_Date',
          'Task_Status',
          'Task_Description',
          'Task_Completion',
          'ResponsibleEmployee/Employee_Full_Name'
        ]
      },
      focusedRowKey: 117,
      autoNavigateToFocusedRow: true,
      columns: [
        {
          dataField: 'Task_ID',
          width: 80
        }, {
          caption: 'Start Date',
          dataField: 'Task_Start_Date',
          dataType: 'date'
        }, {
          caption: 'Assigned To',
          dataField: 'ResponsibleEmployee.Employee_Full_Name',
          cssClass: 'employee',
          allowSorting: false
        }, {
          caption: 'Subject',
          dataField: 'Task_Subject',
          width: 350
        }, {
          caption: 'Status',
          dataField: 'Task_Status'
        }
      ],
      isReady: false
    };
  },
  methods: {
    onFocusedRowChanging(e) {
      var pageSize = e.component.pageSize(),
        pageIndex = e.component.pageIndex(),
        isLoading = e.component.getController('data').isLoading(),
        key = e.event && e.event.key;

      if(!isLoading) {
        if(key && e.prevRowIndex === e.newRowIndex) {
          if(e.newRowIndex === pageSize - 1) {
            e.component.pageIndex(pageIndex + 1).done(function() {
              e.component.option('focusedRowIndex', 0);
            });
          } else if(e.newRowIndex === 0) {
            e.component.pageIndex(pageIndex - 1).done(function() {
              e.component.option('focusedRowIndex', pageSize - 1);
            });
          }
        }
      }
    },
    onFocusedRowChanged: function(e) {
      var data = e.row && e.row.data;
      this.taskSubject = data && data.Task_Subject;
      this.taskDetails = data && data.Task_Description;
      this.taskStatus = data && data.Task_Status;
      this.taskProgress = data && data.Task_Completion ? `${data.Task_Completion }%` : '';
      this.focusedRowKey = e.component.option('focusedRowKey');
    }
  }
};
</script>
