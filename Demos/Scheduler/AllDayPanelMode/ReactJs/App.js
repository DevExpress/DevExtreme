import React from 'react';
import Scheduler from 'devextreme-react/scheduler';
import RadioGroup from 'devextreme-react/radio-group';
import { data } from './data.js';

const currentDate = new Date(2021, 2, 28);
const views = [
  {
    type: 'day',
    name: '4 Days',
    intervalCount: 4,
  },
  'week',
];
const allDayPanelItems = ['all', 'allDay', 'hidden'];
const App = () => {
  const [allDayPanelMode, setAllDayPanelMode] = React.useState('allDay');
  const onChangeAllDayPanelMode = React.useCallback(
    (e) => {
      setAllDayPanelMode(e.value);
    },
    [setAllDayPanelMode],
  );
  return (
    <React.Fragment>
      <Scheduler
        timeZone="America/Los_Angeles"
        dataSource={data}
        views={views}
        defaultCurrentView="day"
        defaultCurrentDate={currentDate}
        allDayPanelMode={allDayPanelMode}
        startDayHour={9}
        height={600}
      />

      <div className="options">
        <div className="option">
          <div className="label">All day panel mode</div>
          <div className="value">
            <RadioGroup
              items={allDayPanelItems}
              value={allDayPanelMode}
              layout="horizontal"
              onValueChanged={onChangeAllDayPanelMode}
            />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
export default App;
