import React from 'react';

import Scheduler, { SchedulerTypes } from 'devextreme-react/scheduler';

import * as AspNetData from 'devextreme-aspnet-data-nojquery';

const url = 'https://js.devexpress.com/Demos/NetCore/api/SchedulerData';
const dataSource = AspNetData.createStore({
  key: 'AppointmentId',
  loadUrl: url,
  insertUrl: url,
  updateUrl: url,
  deleteUrl: url,
  onBeforeSend(_, ajaxOptions) {
    ajaxOptions.xhrFields = { withCredentials: true };
  },
});

const currentDate = new Date(2021, 3, 27);
const views: SchedulerTypes.ViewType[] = ['day', 'workWeek', 'month'];

const App = () => (
  <Scheduler
    timeZone="America/Los_Angeles"
    dataSource={dataSource}
    views={views}
    defaultCurrentView="day"
    defaultCurrentDate={currentDate}
    height={600}
    startDayHour={9}
    endDayHour={19}
    remoteFiltering={true}
    dateSerializationFormat="yyyy-MM-ddTHH:mm:ssZ"
    textExpr="Text"
    startDateExpr="StartDate"
    endDateExpr="EndDate"
    allDayExpr="AllDay"
  />
);

export default App;
