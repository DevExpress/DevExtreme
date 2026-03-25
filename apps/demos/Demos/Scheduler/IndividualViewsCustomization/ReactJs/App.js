import React from 'react';
import Scheduler, {
  Resource,
  View,
  Editing,
  Form as SchedulerForm,
  Item,
} from 'devextreme-react/scheduler';
import { data, priorityData, typeData } from './data.js';

const currentDate = new Date(2021, 3, 27);
const dayOfWeekNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const typeGroups = ['typeId'];
const priorityGroups = ['priorityId'];
const DateCell = ({ data: cellData }) => (
  <>
    <div className="name">{dayOfWeekNames[cellData.date.getDay()]}</div>
    <div className="number">{cellData.date.getDate()}</div>
  </>
);
const App = () => (
  <Scheduler
    timeZone="America/Los_Angeles"
    dataSource={data}
    defaultCurrentView="workWeek"
    showAllDayPanel={false}
    defaultCurrentDate={currentDate}
    height={730}
    startDayHour={7}
    endDayHour={23}
  >
    <View type="day" />
    <View
      type="week"
      groups={typeGroups}
      dateCellComponent={DateCell}
    />
    <View
      type="workWeek"
      groups={priorityGroups}
      startDayHour={9}
      endDayHour={18}
      dateCellComponent={DateCell}
    />
    <View type="month" />
    <Resource
      dataSource={priorityData}
      fieldExpr="priorityId"
      label="Priority"
      allowMultiple={false}
      icon="tags"
    />
    <Resource
      dataSource={typeData}
      fieldExpr="typeId"
      label="Type"
      allowMultiple={false}
    />

    <Editing>
      <SchedulerForm>
        <Item name="mainGroup">
          <Item name="subjectGroup" />
          <Item name="dateGroup" />
          <Item name="repeatGroup" />
          <Item name="resourcesGroup">
            <Item
              name="priorityIdGroup"
              colCount={3}
              colCountByScreen={{ xs: 3 }}
            >
              <Item name="priorityIdIcon" />
              <Item name="priorityIdEditor" />
              <Item name="typeIdEditor" />
            </Item>
          </Item>
          <Item name="descriptionGroup" />
        </Item>
        <Item name="recurrenceGroup" />
      </SchedulerForm>
    </Editing>
  </Scheduler>
);
export default App;
