import React from 'react';

import Scheduler, { Resource, SchedulerTypes } from 'devextreme-react/scheduler';

import { data, resourcesData } from './data.ts';

const currentDate = new Date(2020, 10, 25);
const views: SchedulerTypes.ViewType[] = ['day', 'week', 'month'];

const App = () => (
  <Scheduler
    timeZone="America/Los_Angeles"
    dataSource={data}
    views={views}
    defaultCurrentView="month"
    defaultCurrentDate={currentDate}
    startDayHour={9}
    height={730}
  >
    <Resource
      dataSource={resourcesData}
      fieldExpr="roomId"
      label="Room"
    />
  </Scheduler>
);

export default App;
