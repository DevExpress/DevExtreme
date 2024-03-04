import React from 'react';

import Scheduler, { Resource, View } from 'devextreme-react/scheduler';
import { data, priorityData } from './data.ts';

const currentDate = new Date(2021, 3, 21);

const groups = ['priorityId'];

const App = () => (
  <Scheduler
    timeZone="America/Los_Angeles"
    dataSource={data}
    groups={groups}
    defaultCurrentView={'Vertical Grouping' as any}
    defaultCurrentDate={currentDate}
    startDayHour={9}
    endDayHour={16}
    crossScrollingEnabled={true}
    showAllDayPanel={false}
  >
    <View
      name="Vertical Grouping"
      type="workWeek"
      groupOrientation="vertical"
      cellDuration={60}
      intervalCount={2}
    />
    <View
      name="Horizontal Grouping"
      type="workWeek"
      cellDuration={30}
      intervalCount={2}
    />
    <Resource
      fieldExpr="priorityId"
      allowMultiple={false}
      dataSource={priorityData}
      label="Priority"
    />
  </Scheduler>
);

export default App;
