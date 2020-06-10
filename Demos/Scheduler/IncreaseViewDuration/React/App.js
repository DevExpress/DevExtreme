import React from 'react';

import Scheduler from 'devextreme-react/scheduler';

import { data } from './data.js';

const currentDate = new Date(2017, 4, 1);

const views = [
  { name: '3 Days', type: 'day', intervalCount: 3, startDate: new Date(2017, 3, 30) },
  { name: '2 Work Weeks', type: 'workWeek', intervalCount: 2, startDate: new Date(2017, 3, 3) },
  { name: '2 Months', type: 'month', intervalCount: 2 }
];

class App extends React.Component {
  render() {
    return (
      <Scheduler
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
