import React from 'react';
import Scheduler, { Resource, type SchedulerTypes } from 'devextreme-react/scheduler';
import ArrayStore from 'devextreme/data/array_store';
import { assignees, data, priorities } from './data.ts';

const currentDate = new Date(2021, 4, 11);
const views: SchedulerTypes.ViewType[] = ['agenda'];
const store = new ArrayStore({
  key: 'id',
  data,
});

const App = () => (
  <Scheduler
    timeZone="America/Los_Angeles"
    dataSource={store}
    views={views}
    currentView="agenda"
    defaultCurrentDate={currentDate}
    height={600}
    startDayHour={9}>
    <Resource
      dataSource={assignees}
      allowMultiple={true}
      fieldExpr="assigneeId"
      label="Assignee"
      useColorAsDefault={true}
      icon="user"
    />
    <Resource
      dataSource={priorities}
      fieldExpr="priorityId"
      label="Priority"
      icon="tags"
    />
  </Scheduler>
);

export default App;
