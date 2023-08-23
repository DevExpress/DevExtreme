import React from 'react';
import Scheduler, { Resource } from 'devextreme-react/scheduler';

import { data, resourcesData } from './data.js';

const currentDate = new Date(2021, 2, 25);
const views = [{
  type: 'month',
  name: 'Auto Mode',
  maxAppointmentsPerCell: 'auto',
}, {
  type: 'month',
  name: 'Unlimited Mode',
  maxAppointmentsPerCell: 'unlimited',
}, {
  type: 'month',
  name: 'Numeric Mode',
  maxAppointmentsPerCell: 2,
}];

const App = () => (
  <Scheduler
    timeZone="America/Los_Angeles"
    dataSource={data}
    views={views}
    defaultCurrentView="Auto Mode"
    defaultCurrentDate={currentDate}
    height={650}
  >
    <Resource
      dataSource={resourcesData}
      fieldExpr="roomId"
      label="Room"
    />
  </Scheduler>
);

export default App;
