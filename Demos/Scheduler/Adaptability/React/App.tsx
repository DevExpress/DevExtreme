import React, { useCallback, useRef } from 'react';
import Scheduler, { Resource, SchedulerTypes } from 'devextreme-react/scheduler';
import SpeedDialAction from 'devextreme-react/speed-dial-action';
import { data, priorities } from './data.ts';

const views: SchedulerTypes.ViewType[] = ['week', 'month'];
const cellDuration = 30;

const currentDate = new Date(2021, 2, 25);

const App = () => {
  const schedulerRef = useRef<Scheduler>(null);

  const showAppointmentPopup = useCallback(() => {
    schedulerRef.current?.instance.showAppointmentPopup();
  }, []);

  return (
    <React.Fragment>
      <Scheduler
        ref={schedulerRef}
        timeZone="America/Los_Angeles"
        dataSource={data}
        views={views}
        adaptivityEnabled={true}
        defaultCurrentView="month"
        defaultCurrentDate={currentDate}
        cellDuration={cellDuration}
        height={590}
        startDayHour={9}
      >
        <Resource
          dataSource={priorities}
          fieldExpr="priorityId"
          label="Priority"
        />
      </Scheduler>
      <SpeedDialAction
        icon="plus"
        onClick={showAppointmentPopup}
      />
    </React.Fragment>
  );
};

export default App;
