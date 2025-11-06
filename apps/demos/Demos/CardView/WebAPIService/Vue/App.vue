<template>
  <DxCardView
    :data-source="dataSource"
    :remote-operations="true"
    cards-per-row="auto"
    :card-min-width="280"
    :word-wrap-enabled="true"
  >
    <DxSearchPanel
      :visible="true"
    />
    <DxHeaderFilter
      :visible="true"
    />
    <DxEditing
      :allow-adding="true"
      :allow-updating="true"
      :allow-deleting="true"
      :popup="{ width: 700, height: 400 }"
    >
      <DxForm>
        <DxItem
          dataField="Task_Subject"
        />
        <DxItem
          dataField="Task_Start_Date"
        />
        <DxItem
          dataField="Task_Due_Date"
        />
        <DxItem
          data-field="Task_Priority"
          editor-type="dxSelectBox"
          :editor-options="{ dataSource: ['Low', 'Normal', 'High', 'Urgent'] }"
        />
        <DxItem
          dataField="Task_Status"
        />
      </DxForm>
    </DxEditing>
    <DxColumn
      data-field="Task_Subject"
      caption="Subject"
    >
      <DxRequiredRule/>
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
    <DxColumn
      data-field="Task_Priority"
      caption="Priority"
    />
    <DxColumn
      data-field="Task_Status"
      caption="Status"
    />
  </DxCardView>
</template>
<script setup lang="ts">
import {
  DxCardView, DxColumn, DxEditing, DxSearchPanel, DxHeaderFilter, DxRequiredRule, DxForm, DxItem,
} from 'devextreme-vue/card-view';
import * as AspNetData from 'devextreme-aspnet-data-nojquery';
import 'devextreme-vue/text-area';

const url = 'https://js.devexpress.com/Demos/NetCore/api/TreeListTasks';

const dataSource = AspNetData.createStore({
  key: 'Task_ID',
  loadUrl: `${url}/Tasks`,
  insertUrl: `${url}/InsertTask`,
  updateUrl: `${url}/UpdateTask`,
  deleteUrl: `${url}/DeleteTask`,
  onBeforeSend(method, ajaxOptions) {
    ajaxOptions.xhrFields = { withCredentials: true };
  },
});
</script>
