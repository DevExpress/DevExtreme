import React from 'react';

import Scheduler, { Resource } from 'devextreme-react/scheduler';

import { data, resourcesData, priorityData } from './data.js';

const currentDate = new Date(2021, 1, 2);
const views = ['timelineDay', 'timelineWeek', 'timelineWorkWeek', 'timelineMonth'];
const groups = ['priority'];

class App extends React.Component {
  render() {
    return (
      <Scheduler
        dataSource={data}
        views={views}
        defaultCurrentView="timelineMonth"
        defaultCurrentDate={currentDate}
        height={580}
        groups={groups}
        cellDuration={60}
        firstDayOfWeek={0}
        startDayHour={8}
        endDayHour={20}>
        <Resource
          fieldExpr="ownerId"
          allowMultiple={true}
          dataSource={resourcesData}
          label="Owner"
          useColorAsDefault={ true }
        />
        <Resource
          fieldExpr="priority"
          allowMultiple={false}
          dataSource={priorityData}
          label="Priority"
        />
      </Scheduler>
    );
  }
}

export default App;
