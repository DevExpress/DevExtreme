import React from 'react';
import CardView, { Column, Paging, HeaderFilter, SearchPanel } from 'devextreme-react/card-view';
import { tasks } from './data.ts';

const App = () => (
  <CardView
    dataSource={tasks}
    keyExpr="Task_ID"
    cardsPerRow={2}
  >
    <Paging
      pageSize={4}
    />
    <SearchPanel
      visible={true}
      defaultText="an"
    />
    <HeaderFilter
      visible={true}
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
