import React, { useCallback, useState } from 'react';
import Scheduler, { SchedulerTypes } from 'devextreme-react/scheduler';
import RadioGroup, { RadioGroupTypes } from 'devextreme-react/radio-group';
import { data } from './data.ts';

const currentDate = new Date(2021, 2, 28);
const views: SchedulerTypes.Properties['views'] = [{
  type: 'day',
  name: '4 Days',
  intervalCount: 4,
}, 'week'];

const allDayPanelItems = ['all', 'allDay', 'hidden'];

const App = () => {
  const [allDayPanelMode, setAllDayPanelMode] = useState<SchedulerTypes.AllDayPanelMode>('allDay');

  const onChangeAllDayPanelMode = useCallback((e: RadioGroupTypes.ValueChangedEvent) => {
    setAllDayPanelMode(e.value);
  }, [setAllDayPanelMode]);

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
