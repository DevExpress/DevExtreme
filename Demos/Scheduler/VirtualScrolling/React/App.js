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

const startDay = new Date(2021, 1, 1);
const endDay = new Date(2021, 1, 28);
const startDayHour = 8;
const endDayHour = 20;

const appointments = generateAppointments(startDay, endDay, startDayHour, endDayHour);

function App() {
  return (
    <Scheduler
      dataSource={appointments}
      height={600}
      views={views}
      defaultCurrentView="Timeline"
      defaultCurrentDate={currentDate}
      firstDayOfWeek={0}
      startDayHour={startDayHour}
      endDayHour={endDayHour}
      cellDuration={60}
      showAllDayPanel={false}
      scrolling={scrolling}
      groups={groups}
      resources={resourcesData}
    />
  );
}

export default App;
