import React from 'react';
import Scheduler from 'devextreme-react/scheduler';
import { data } from './data.js';

const currentDate = new Date(2021, 2, 28);
const views = ['week', 'month'];
const App = () => (
  <Scheduler
    timeZone="America/Los_Angeles"
    dataSource={data}
    views={views}
    defaultCurrentView="week"
    defaultCurrentDate={currentDate}
    height={730}
    startDayHour={9}
  />
);
export default App;
