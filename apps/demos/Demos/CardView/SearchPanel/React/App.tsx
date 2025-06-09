import React from 'react';
import CardView, { Column, Paging } from 'devextreme-react/card-view';
import { tasks } from './data.ts';

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
    cardsPerRow={2}
    headerFilter={headerFilterConfig}
    searchPanel={searchPanelConfig}
  >
    <Paging
      pageSize={4}
    />
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
