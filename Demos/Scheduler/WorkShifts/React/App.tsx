import React from 'react';

import Scheduler, { SchedulerTypes } from 'devextreme-react/scheduler';
import RadioGroup from 'devextreme-react/radio-group';

import { data, shifts } from './data.ts';

const currentDate = new Date(2021, 2, 30);
const views: SchedulerTypes.ViewType[] = ['day', 'week'];

const App = () => {
  const [currentShift, setCurrentShift] = React.useState(shifts[0]);

  return <React.Fragment>
    <div className="options">
      <div className="option">
        <div className="label">Work Hours</div>
        <div className="value">
          <RadioGroup
            defaultValue={shifts[0]}
            items={shifts}
            layout= 'horizontal'
            onValueChange={setCurrentShift}
          />
        </div>
      </div>
    </div>
    <br />
    <Scheduler
      timeZone= 'America/Los_Angeles'
      dataSource={data}
      views={views}
      defaultCurrentView='week'
      currentDate={currentDate}
      startDayHour= {0}
      endDayHour= {8}
      offset={currentShift.offset}
      cellDuration={60}
      showAllDayPanel={false}
    />
  </React.Fragment>;
};

export default App;
