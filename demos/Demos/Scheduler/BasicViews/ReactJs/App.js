import React from 'react';
import Scheduler from 'devextreme-react/scheduler';
import { data } from './data.js';

const currentDate = new Date(2021, 3, 29);
const views = ['day', 'week', 'workWeek', 'month'];
const App = () => (
  <Scheduler
    timeZone="America/Los_Angeles"
    dataSource={data}
    views={views}
    defaultCurrentView="day"
    defaultCurrentDate={currentDate}
    height={730}
    startDayHour={9}
  />
);
export default App;
