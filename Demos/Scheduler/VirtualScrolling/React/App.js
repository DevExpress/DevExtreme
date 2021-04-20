import React from 'react';

import Scheduler from 'devextreme-react/scheduler';
import {
  resources,
  generateAppointments
} from './data.js';

const currentDate = new Date(2021, 1, 2);
const views = [
  {
    type: 'timelineWorkWeek',
    name: 'Timeline',
    groupOrientation: 'vertical'
  },
  {
    type: 'workWeek',
    groupOrientation: 'vertical'
  },
  {
    type: 'month',
    groupOrientation: 'horizontal'
  }
];

const scrolling = { mode: 'virtual' };

const resourcesData = [{
  fieldExpr: 'humanId',
  dataSource: resources,
  label: 'Employee'
}];

const groups = ['humanId'];
const appointments = generateAppointments();
class App extends React.Component {
  render() {
    return (
      <Scheduler
        dataSource={appointments}
        height={600}
        views={views}
        defaultCurrentView="Timeline"
        defaultCurrentDate={currentDate}
        firstDayOfWeek={0}
        startDayHour={8}
        endDayHour={20}
        cellDuration={60}
        showAllDayPanel={false}
        scrolling={scrolling}
        groups={groups}
        resources={resourcesData}
      />
    );
  }
}

export default App;
