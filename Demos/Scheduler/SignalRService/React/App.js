import React from 'react';

import Scheduler from 'devextreme-react/scheduler';

import * as AspNetData from 'devextreme-aspnet-data-nojquery';

import { HubConnectionBuilder, HttpTransportType } from '@aspnet/signalr';

const BASE_PATH = 'https://js.devexpress.com/Demos/NetCore/';
const url = `${BASE_PATH}api/SchedulerSignalR`;

function createStore() {
  return AspNetData.createStore({
    key: 'AppointmentId',
    loadUrl: url,
    insertUrl: url,
    updateUrl: url,
    deleteUrl: url,
    onBeforeSend: function(method, ajaxOptions) {
      ajaxOptions.xhrFields = { withCredentials: true };
    }
  });
}

const store1 = createStore();
const store2 = createStore();
const currentDate = new Date(2021, 4, 25);
const views = ['day', 'workWeek'];

var connection = new HubConnectionBuilder()
  .withUrl(`${BASE_PATH}schedulerSignalRHub`, {
    skipNegotiation: true,
    transport: HttpTransportType.WebSockets
  })
  .build();

connection
  .start()
  .then(() => {
    connection.on('update', (key, data) => {
      store1.push([{ type: 'update', key: key, data: data }]);
      store2.push([{ type: 'update', key: key, data: data }]);
    });

    connection.on('insert', (data) => {
      store1.push([{ type: 'insert', data: data }]);
      store2.push([{ type: 'insert', data: data }]);
    });

    connection.on('remove', (key) => {
      store1.push([{ type: 'remove', key: key }]);
      store2.push([{ type: 'remove', key: key }]);
    });
  });

class App extends React.Component {
  render() {
    return (
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
            textExpr= "Text"
            startDateExpr="StartDate"
            descriptionExpr="Description"
            endDateExpr="EndDate"
            allDayExpr="AllDay" />
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
            dateSerializationFormat="yyyy-MM-ddTHH:mm:ssZ"
            textExpr="Text"
            startDateExpr="StartDate"
            endDateExpr="EndDate"
            allDayExpr="AllDay" />
        </div>
      </div>
    );
  }
}

export default App;
