import React from 'react';

import Scheduler, { Resource } from 'devextreme-react/scheduler';

import { data, resourcesData } from './data.js';

const currentDate = new Date(2020, 10, 25);
const views = ['day', 'week', 'month'];

class App extends React.Component {
  render() {
    return (
      <Scheduler
        timeZone="America/Los_Angeles"
        dataSource={data}
        views={views}
        defaultCurrentView="month"
        defaultCurrentDate={currentDate}
        startDayHour={9}
        height={600}
      >
        <Resource
          dataSource={resourcesData}
          fieldExpr="roomId"
          label="Room"
        />
      </Scheduler>
    );
  }
}

export default App;
