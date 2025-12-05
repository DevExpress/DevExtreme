import React from 'react';
import Scheduler, {
  Resource,
  Editing,
  Form as SchedulerForm,
  Item,
  type SchedulerTypes,
} from 'devextreme-react/scheduler';
import ArrayStore from 'devextreme/data/array_store';
import { assignees, data, priorities } from './data.ts';

const currentDate = new Date(2021, 4, 11);
const views: SchedulerTypes.ViewType[] = ['agenda'];
const store = new ArrayStore({
  key: 'id',
  data,
});

const App = () => (
  <Scheduler
    timeZone="America/Los_Angeles"
    dataSource={store}
    views={views}
    currentView="agenda"
    defaultCurrentDate={currentDate}
    height={600}
    startDayHour={9}>
    <Resource
      dataSource={assignees}
      allowMultiple={true}
      fieldExpr="assigneeId"
      label="Assignee"
      useColorAsDefault={true}
      icon="user"
    />
    <Resource
      dataSource={priorities}
      fieldExpr="priorityId"
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
            <Item name="assigneeIdGroup" colCount={3} colCountByScreen={{ xs: 3 }}>
              <Item name="assigneeIdIcon" />
              <Item name="assigneeId" />
              <Item name="priorityId" />
            </Item>
          </Item>
        </Item>
        <Item name="recurrenceGroup" />
      </SchedulerForm>
    </Editing>
  </Scheduler>
);

export default App;
