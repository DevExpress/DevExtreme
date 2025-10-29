import React from 'react';

import Scheduler, { Resource, type SchedulerTypes } from 'devextreme-react/scheduler';

import { data, resourcesData, priorityData } from './data.ts';

const currentDate = new Date(2021, 1, 2);
const views: SchedulerTypes.ViewType[] = ['timelineDay', 'timelineWeek', 'timelineWorkWeek', 'timelineMonth'];
const groups = ['priority'];

const App = () => (
  <Scheduler
    timeZone="America/Los_Angeles"
    dataSource={data}
    views={views}
    defaultCurrentView="timelineMonth"
    defaultCurrentDate={currentDate}
    height={580}
    groups={groups}
    cellDuration={60}
    firstDayOfWeek={0}
    startDayHour={8}
    endDayHour={20}
  >
    <Resource
      fieldExpr="ownerId"
      allowMultiple={true}
      dataSource={resourcesData}
      label="Owner"
      useColorAsDefault={true}
      icon="user"
    />
    <Resource
      fieldExpr="priority"
      allowMultiple={false}
      dataSource={priorityData}
      label="Priority"
      icon="tags"
    />
  </Scheduler>
);

export default App;
