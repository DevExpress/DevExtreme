import React from 'react';

import Scheduler, { SchedulerTypes } from 'devextreme-react/scheduler';

import { data } from './data.ts';

const currentDate = new Date(2021, 2, 28);
const views: SchedulerTypes.ViewType[] = ['week', 'month'];

const App = () => (
  <Scheduler
    timeZone="America/Los_Angeles"
    dataSource={data}
    views={views}
    defaultCurrentView="week"
    defaultCurrentDate={currentDate}
    height={730}
    startDayHour={9} />
);

export default App;
