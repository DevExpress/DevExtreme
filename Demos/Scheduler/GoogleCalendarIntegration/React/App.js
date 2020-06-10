import 'whatwg-fetch';
import React from 'react';

import Scheduler from 'devextreme-react/scheduler';

import CustomStore from 'devextreme/data/custom_store';

function getData(_, requestOptions) {
  const PUBLIC_KEY = 'AIzaSyBnNAISIUKe6xdhq1_rjor2rxoI3UlMY7k',
    CALENDAR_ID = 'f7jnetm22dsjc3npc2lu3buvu4@group.calendar.google.com';
  const dataUrl = [ 'https://www.googleapis.com/calendar/v3/calendars/',
    CALENDAR_ID, '/events?key=', PUBLIC_KEY].join('');

  return fetch(dataUrl, requestOptions).then(
    (response) => response.json()
  ).then((data) => data.items);
}

const dataSource = new CustomStore({
  load: (options) => getData(options, { showDeleted: false })
});

const currentDate = new Date(2017, 4, 25);
const views = ['day', 'workWeek', 'month'];

class App extends React.Component {
  render() {
    return (
      <React.Fragment>
        <div className="long-title">
          <h3>Tasks for Employees (USA Office)</h3>
        </div>
        <Scheduler
          dataSource={dataSource}
          views={views}
          defaultCurrentView="workWeek"
          defaultCurrentDate={currentDate}
          height={500}
          startDayHour={7}
          editing={false}
          showAllDayPanel={false}
          startDateExpr="start.dateTime"
          endDateExpr="end.dateTime"
          textExpr="summary"
          timeZone="America/Los_Angeles" />
      </React.Fragment>

    );
  }
}

export default App;

