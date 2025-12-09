import React from 'react';
import Scheduler, {
  Resource,
  Editing,
  Form as SchedulerForm,
  Item,
} from 'devextreme-react/scheduler';
import { data, resourcesData, priorityData } from './data.js';

const currentDate = new Date(2021, 1, 2);
const views = ['timelineDay', 'timelineWeek', 'timelineWorkWeek', 'timelineMonth'];
const groups = ['priority'];
const App = () => (
  <Scheduler
    timeZone="America/Los_Angeles"
    dataSource={data}
    views={views}
    defaultCurrentView="timelineMonth"
    defaultCurrentDate={currentDate}
    height={580}
    groups={groups}
    cellDuration={60}
    firstDayOfWeek={0}
    startDayHour={8}
    endDayHour={20}
  >
    <Resource
      fieldExpr="ownerId"
      allowMultiple={true}
      dataSource={resourcesData}
      label="Owner"
      useColorAsDefault={true}
      icon="user"
    />
    <Resource
      fieldExpr="priority"
      allowMultiple={false}
      dataSource={priorityData}
      label="Priority"
      icon="tags"
    />

    <Editing>
      <SchedulerForm>
        <Item name="mainGroup">
          <Item name="subjectGroup" />
          <Item name="dateGroup" />
          <Item name="repeatGroup" />
          <Item name="resourcesGroup">
            <Item
              name="ownerIdGroup"
              colCount={3}
              colCountByScreen={{ xs: 3 }}
            >
              <Item name="ownerIdIcon" />
              <Item name="ownerId" />
              <Item name="priority" />
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
