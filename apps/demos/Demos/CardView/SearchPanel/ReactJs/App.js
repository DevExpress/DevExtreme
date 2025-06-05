import React from 'react';
import CardView, { Column } from 'devextreme-react/card-view';
import { tasks } from './data.js';
// TODO: Nested component does not exist
const headerFilterConfig = {
  visible: true,
};
// TODO: Nested component does not exist
const searchPanelConfig = {
  visible: true,
  text: 'an',
};
const App = () => (
  <CardView
    dataSource={tasks}
    keyExpr="Task_ID"
    headerFilter={headerFilterConfig}
    searchPanel={searchPanelConfig}
    cardMinWidth={100}
    wordWrapEnabled={true}
  >
    <Column
      dataField="Task_Subject"
      caption="Subject"
    />
    <Column
      dataField="Task_Start_Date"
      caption="Start Date"
      dataType="date"
    />
    <Column
      dataField="Task_Due_Date"
      caption="Due Date"
      dataType="date"
    />
    <Column
      dataField="Task_Priority"
      caption="Priority"
    />
    <Column
      dataField="Task_Status"
      caption="Status"
    />
  </CardView>
);
export default App;
