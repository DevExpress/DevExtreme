import React from 'react';
import Scheduler from 'devextreme-react/scheduler';
import RadioGroup from 'devextreme-react/radio-group';
import { data, shifts } from './data.js';

const currentDate = new Date(2021, 2, 30);
const views = ['day', 'week'];
const App = () => {
  // eslint-disable-next-line no-unused-vars
  const [offset, setOffset] = React.useState(0);
  const onShiftChanged = React.useCallback((e) => {
    setOffset(e.value);
  }, []);
  return (
    <React.Fragment>
      <div className="options">
        <div className="option">
          <div className="label">Work Hours</div>
          <div className="value">
            <RadioGroup
              defaultValue={shifts[0]}
              items={shifts}
              layout="horizontal"
              onValueChanged={onShiftChanged}
            />
          </div>
        </div>
      </div>
      <br />
      <Scheduler
        timeZone="America/Los_Angeles"
        dataSource={data}
        views={views}
        defaultCurrentView="week"
        currentDate={currentDate}
        startDayHour={0}
        endDayHour={8}
        // offset={offset}
        height={600}
        showAllDayPanel={false}
      />
    </React.Fragment>
  );
};
export default App;
