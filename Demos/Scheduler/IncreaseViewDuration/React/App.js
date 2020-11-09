import React from 'react';

import Scheduler from 'devextreme-react/scheduler';

import { data } from './data.js';

const currentDate = new Date(2021, 3, 5);

const views = [
  { name: '3 Days', type: 'day', intervalCount: 3, startDate: new Date(2021, 3, 4) },
  { name: '2 Work Weeks', type: 'workWeek', intervalCount: 2, startDate: new Date(2021, 2, 4) },
  { name: '2 Months', type: 'month', intervalCount: 2 }
];

class App extends React.Component {
  render() {
    return (
      <Scheduler
        timeZone="America/Los_Angeles"
        dataSource={data}
        views={views}
        defaultCurrentView="day"
        defaultCurrentDate={currentDate}
        startDayHour={8}
        height={580}
      />
    );
  }
}

export default App;
