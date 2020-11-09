import React from 'react';
import Scheduler, { Resource, View } from 'devextreme-react/scheduler';

import { data, priorityData, typeData } from './data.js';

const currentDate = new Date(2021, 4, 25);
const dayOfWeekNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const typeGroups = ['typeId'];
const priorityGroups = ['priorityId'];

class App extends React.Component {
  render() {
    return (
      <Scheduler
        timeZone="America/Los_Angeles"
        dataSource={data}
        defaultCurrentView="workWeek"
        showAllDayPanel={false}
        defaultCurrentDate={currentDate}
        height={600}
        startDayHour={7}
        endDayHour={23}
      >
        <View
          type="day"
        />
        <View
          type="week"
          groups={typeGroups}
          dateCellRender={renderDateCell}
        />
        <View
          type="workWeek"
          groups={priorityGroups}
          startDayHour={9}
          endDayHour={18}
          dateCellRender={renderDateCell}
        />
        <View
          type="month"
        />
        <Resource
          dataSource={priorityData}
          fieldExpr="priorityId"
          label="Priority"
          allowMultiple={false}
        />
        <Resource
          dataSource={typeData}
          fieldExpr="typeId"
          label="Type"
          allowMultiple={false}
        />
      </Scheduler>
    );
  }
}

function renderDateCell(cellData) {
  return (
    <React.Fragment>
      <div className="name">{dayOfWeekNames[cellData.date.getDay()]}</div>
      <div className="number">{cellData.date.getDate()}</div>
    </React.Fragment>
  );
}

export default App;
