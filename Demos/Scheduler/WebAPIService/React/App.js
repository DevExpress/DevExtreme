import React from 'react';

import Scheduler from 'devextreme-react/scheduler';

import * as AspNetData from 'devextreme-aspnet-data-nojquery';

const url = 'https://js.devexpress.com/Demos/Mvc/api/SchedulerData';
const dataSource = AspNetData.createStore({
  key: 'AppointmentId',
  loadUrl: `${url }/Get`,
  insertUrl: `${url }/Post`,
  updateUrl: `${url }/Put`,
  deleteUrl: `${url }/Delete`,
  onBeforeSend(_, ajaxOptions) {
    ajaxOptions.xhrFields = { withCredentials: true };
  }
});

const currentDate = new Date(2021, 4, 25);
const views = ['day', 'workWeek', 'month'];

class App extends React.Component {
  render() {
    return (
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
        allDayExpr="AllDay" />
    );
  }
}

export default App;
