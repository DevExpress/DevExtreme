import React from 'react';
import Scheduler, { Resource } from 'devextreme-react/scheduler';
import { data, resourcesData } from './data.js';

const currentDate = new Date(2020, 10, 25);
const views = ['day', 'week', 'month'];
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
