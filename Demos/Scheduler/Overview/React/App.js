import React from 'react';

import Scheduler, { Resource } from 'devextreme-react/scheduler';

import { employees, data } from './data.js';
import DataCell from './DataCell.js';
import ResourceCell from './ResourceCell.js';

const currentDate = new Date(2021, 7, 2, 11, 30);
const groups = ['employeeID'];
const views = ['month'];

class App extends React.Component {
  render() {
    return (
      <Scheduler
        timeZone="America/Los_Angeles"
        dataSource={data}
        dataCellComponent={DataCell}
        resourceCellComponent={ResourceCell}
        groups={groups}
        views={views}
        defaultCurrentView="month"
        defaultCurrentDate={currentDate}
        height={600}
        showAllDayPanel={true}
        firstDayOfWeek={1}
        startDayHour={8}
        endDayHour={18}
      >
        <Resource
          label="Employee"
          fieldExpr="employeeID"
          dataSource={employees}
          allowMultiple={false}
        />
      </Scheduler>
    );
  }
}

export default App;
