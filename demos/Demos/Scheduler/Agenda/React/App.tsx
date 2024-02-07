import React from 'react';
import Scheduler, { Resource, SchedulerTypes } from 'devextreme-react/scheduler';
import { assignees, data, priorities } from './data.ts';

const currentDate = new Date(2021, 4, 11);
const views: SchedulerTypes.ViewType[] = ['agenda'];

const App = () => (
  <Scheduler
    timeZone="America/Los_Angeles"
    dataSource={data}
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
    />
    <Resource
      dataSource={priorities}
      fieldExpr="priorityId"
      label="Priority"
    />
  </Scheduler>
);

export default App;
