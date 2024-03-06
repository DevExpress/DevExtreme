import React from 'react';

import Scheduler, { Resource, SchedulerTypes } from 'devextreme-react/scheduler';

import { employees, data } from './data.ts';
import DataCell from './DataCell.tsx';
import ResourceCell from './ResourceCell.tsx';

const currentDate = new Date(2021, 5, 2, 11, 30);
const groups = ['employeeID'];
const views: SchedulerTypes.ViewType[] = ['month'];

const App = () => (
  <Scheduler
    timeZone="America/Los_Angeles"
    dataSource={data}
    dataCellComponent={DataCell}
    resourceCellComponent={ResourceCell}
    groups={groups}
    views={views}
    defaultCurrentView="month"
    defaultCurrentDate={currentDate}
    height={600}
    showAllDayPanel={true}
    firstDayOfWeek={1}
    startDayHour={8}
    endDayHour={18}
  >
    <Resource
      label="Employee"
      fieldExpr="employeeID"
      dataSource={employees}
      allowMultiple={false}
    />
  </Scheduler>
);

export default App;
