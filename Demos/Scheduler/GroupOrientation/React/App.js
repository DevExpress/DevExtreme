import React from 'react';

import Scheduler, { Resource, View } from 'devextreme-react/scheduler';

import { data, priorityData } from './data.js';

const currentDate = new Date(2021, 4, 21);
const views = [{
  type: 'workWeek',
  name: 'Vertical Grouping',
  groupOrientation: 'vertical',
  cellDuration: 60,
  intervalCount: 2
}, {
  type: 'workWeek',
  name: 'Horizontal Grouping',
  groupOrientation: 'horizontal',
  cellDuration: 30,
  intervalCount: 2
}];

const groups = ['priorityId'];

class App extends React.Component {
  render() {
    return (
      <Scheduler
        dataSource={data}
        views={views}
        groups={groups}
        defaultCurrentView="Vertical Grouping"
        defaultCurrentDate={currentDate}
        startDayHour={9}
        endDayHour={16}
        crossScrollingEnabled={true}
        showAllDayPanel={false}>
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
  }
}

export default App;
