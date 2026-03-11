import React, { useCallback, useState } from 'react';
import Scheduler, {
  Resource,
  Editing,
  Form as SchedulerForm,
  Item,
} from 'devextreme-react/scheduler';
import RadioGroup from 'devextreme-react/radio-group';
import {
  data, assignees, rooms, priorities, resourcesList,
} from './data.js';

const currentDate = new Date(2021, 3, 27);
const views = ['workWeek'];
const App = () => {
  const [currentResource, setCurrentResource] = useState(resourcesList[0]);
  const onRadioGroupValueChanged = useCallback((e) => {
    setCurrentResource(e.value);
  }, []);
  return (
    <>
      <Scheduler
        timeZone="America/Los_Angeles"
        dataSource={data}
        views={views}
        defaultCurrentView="workWeek"
        defaultCurrentDate={currentDate}
        startDayHour={9}
        endDayHour={19}
        height={600}
      >
        <Resource
          dataSource={rooms}
          fieldExpr="roomId"
          label="Room"
          useColorAsDefault={currentResource === 'Room'}
          icon="conferenceroomoutline"
        />
        <Resource
          dataSource={priorities}
          fieldExpr="priorityId"
          label="Priority"
          useColorAsDefault={currentResource === 'Priority'}
          icon="tags"
        />
        <Resource
          dataSource={assignees}
          allowMultiple={true}
          fieldExpr="assigneeId"
          label="Assignee"
          useColorAsDefault={currentResource === 'Assignee'}
          icon="user"
        />

        <Editing>
          <SchedulerForm>
            <Item name="mainGroup">
              <Item name="subjectGroup" />
              <Item name="dateGroup" />
              <Item name="repeatGroup" />
              <Item name="resourcesGroup">
                <Item
                  name="roomIdGroup"
                  colCount={3}
                  colCountByScreen={{ xs: 3 }}
                >
                  <Item name="roomIdIcon" />
                  <Item name="roomIdEditor" />
                  <Item name="priorityIdEditor" />
                </Item>
                <Item name="assigneeIdGroup" />
              </Item>
              <Item name="descriptionGroup" />
            </Item>
            <Item name="recurrenceGroup" />
          </SchedulerForm>
        </Editing>
      </Scheduler>
      <div className="options">
        <div className="caption">Use colors of:</div>
        <div className="option">
          <RadioGroup
            items={resourcesList}
            value={currentResource}
            layout="horizontal"
            onValueChanged={onRadioGroupValueChanged}
          />
        </div>
      </div>
    </>
  );
};
export default App;
