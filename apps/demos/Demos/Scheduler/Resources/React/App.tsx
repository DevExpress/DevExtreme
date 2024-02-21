import React, { useCallback, useState } from 'react';

import Scheduler, { Resource, SchedulerTypes } from 'devextreme-react/scheduler';

import RadioGroup, { RadioGroupTypes } from 'devextreme-react/radio-group';

import {
  data, assignees, rooms, priorities, resourcesList,
} from './data.ts';

const currentDate = new Date(2021, 3, 27);
const views: SchedulerTypes.ViewType[] = ['workWeek'];

const App = () => {
  const [currentResource, setCurrentResource] = useState(resourcesList[0]);

  const onRadioGroupValueChanged = useCallback((e: RadioGroupTypes.ValueChangedEvent) => {
    setCurrentResource(e.value);
  }, []);

  return (
    <React.Fragment>
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
        />
        <Resource
          dataSource={priorities}
          fieldExpr="priorityId"
          label="Priority"
          useColorAsDefault={currentResource === 'Priority'}
        />
        <Resource
          dataSource={assignees}
          allowMultiple={true}
          fieldExpr="assigneeId"
          label="Assignee"
          useColorAsDefault={currentResource === 'Assignee'}
        />
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
    </React.Fragment>
  );
};

export default App;
