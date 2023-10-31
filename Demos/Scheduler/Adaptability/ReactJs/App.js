import React from 'react';
import Scheduler, { Resource } from 'devextreme-react/scheduler';
import SpeedDialAction from 'devextreme-react/speed-dial-action';
import { data, priorities } from './data.js';

const views = ['week', 'month'];
const cellDuration = 30;
const currentDate = new Date(2021, 2, 25);
const App = () => {
  const schedulerRef = React.useRef(null);
  const showAppointmentPopup = React.useCallback(() => {
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
