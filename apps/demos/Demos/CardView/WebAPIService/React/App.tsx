import React from 'react';
import * as AspNetData from 'devextreme-aspnet-data-nojquery';
import CardView, { Column, Editing, RequiredRule } from 'devextreme-react/card-view';

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

const App = () => (
  <CardView
    dataSource={dataSource}
    remoteOperations={true}
    headerFilter={headerFilterConfig}
    searchPanel={searchPanelConfig}
    cardMinWidth={100}
    wordWrapEnabled={true}
  >
    <Editing
      allowAdding={true}
      allowUpdating={true}
      allowDeleting={true}
    ></Editing>
    <Column
      dataField="Task_Subject"
      caption="Subject"
    >
      <RequiredRule/>
    </Column>
    <Column
      dataField="Task_Start_Date"
      caption="Start Date"
      dataType="date"
    ></Column>
    <Column
      dataField="Task_Due_Date"
      caption="Due Date"
      dataType="date"
    ></Column>
    <Column
      dataField="Task_Priority"
      caption="Priority"
    ></Column>
    <Column
      dataField="Task_Status"
      caption="Status"
    ></Column>
  </CardView>
);

export default App;
