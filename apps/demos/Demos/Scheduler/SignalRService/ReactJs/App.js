import React from 'react';
import Scheduler from 'devextreme-react/scheduler';
import * as AspNetData from 'devextreme-aspnet-data-nojquery';
import { HubConnectionBuilder, HttpTransportType } from '@aspnet/signalr';

const BASE_PATH = 'https://js.devexpress.com/Demos/NetCore/';
const url = `${BASE_PATH}api/SchedulerSignalR`;
const createStore = () =>
  AspNetData.createStore({
    key: 'AppointmentId',
    loadUrl: url,
    insertUrl: url,
    updateUrl: url,
    deleteUrl: url,
    onBeforeSend(method, ajaxOptions) {
      ajaxOptions.xhrFields = { withCredentials: true };
    },
  });
const store1 = createStore();
const store2 = createStore();
const currentDate = new Date(2021, 3, 27);
const views = ['day', 'workWeek'];
const connection = new HubConnectionBuilder()
  .withUrl(`${BASE_PATH}schedulerSignalRHub`, {
    skipNegotiation: true,
    transport: HttpTransportType.WebSockets,
  })
  .build();
connection.start().then(() => {
  connection.on('update', (key, data) => {
    store1.push([{ type: 'update', key, data }]);
    store2.push([{ type: 'update', key, data }]);
  });
  connection.on('insert', (data) => {
    store1.push([{ type: 'insert', data }]);
    store2.push([{ type: 'insert', data }]);
  });
  connection.on('remove', (key) => {
    store1.push([{ type: 'remove', key }]);
    store2.push([{ type: 'remove', key }]);
  });
});
const App = () => (
  <div className="schedulers">
    <div className="column-1">
      <Scheduler
        timeZone="America/Los_Angeles"
        dataSource={store1}
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
        descriptionExpr="Description"
        endDateExpr="EndDate"
        allDayExpr="AllDay"
      />
    </div>
    <div className="column-2">
      <Scheduler
        timeZone="America/Los_Angeles"
        dataSource={store2}
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
    </div>
  </div>
);
export default App;
