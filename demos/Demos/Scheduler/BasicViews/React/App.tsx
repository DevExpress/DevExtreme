import React from 'react';

import Scheduler, { SchedulerTypes } from 'devextreme-react/scheduler';

import { data } from './data.ts';

const currentDate = new Date(2021, 3, 29);
const views: SchedulerTypes.ViewType[] = ['day', 'week', 'workWeek', 'month'];

const App = () => (
  <Scheduler
    timeZone="America/Los_Angeles"
    dataSource={data}
    views={views}
    defaultCurrentView="day"
    defaultCurrentDate={currentDate}
    height={730}
    startDayHour={9} />
);

export default App;
