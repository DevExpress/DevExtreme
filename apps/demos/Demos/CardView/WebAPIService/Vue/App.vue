<template>
  <DxCardView
    :data-source="dataSource"
    :remote-operations="true"
    :word-wrap-enabled="true"
    :header-filter="headerFilterConfig"
    :search-panel="searchPanelConfig"
  >
    <DxEditing
      :allow-adding="true"
      :allow-updating="true"
      :allow-deleting="true"
    ></DxEditing>
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
    ></DxColumn>
    <DxColumn
      data-field="Task_Due_Date"
      caption="Due Date"
      data-type="date"
    ></DxColumn>
    <DxColumn
      data-field="Task_Priority"
      caption="Priority"
    ></DxColumn>
    <DxColumn
      data-field="Task_Status"
      caption="Status"
    ></DxColumn>
  </DxCardView>
</template>
<script setup lang="ts">
  import { DxCardView, DxColumn, DxEditing, DxRequiredRule } from 'devextreme-vue/card-view';
  import * as AspNetData from 'devextreme-aspnet-data-nojquery';

  // TODO: Nested component does not exist
  const headerFilterConfig = {
    visible: true,
  };

  // TODO: Nested component does not exist
  const searchPanelConfig = {
    visible: true,
  };

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
