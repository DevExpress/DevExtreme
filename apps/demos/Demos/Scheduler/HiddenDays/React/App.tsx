import React, { useCallback, useMemo, useState } from 'react';

import Scheduler, { type SchedulerTypes } from 'devextreme-react/scheduler';
import CheckBox, { type CheckBoxTypes } from 'devextreme-react/check-box';
import { ArrayStore } from 'devextreme-react/common/data';
import { data } from './data.ts';

const dataSource = new ArrayStore({
  key: 'id',
  data,
});

const allDays: SchedulerTypes.DayOfWeek[] = [0, 1, 2, 3, 4, 5, 6];
const dayLabels = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const defaultVisible: SchedulerTypes.DayOfWeek[] = [0, 1, 2, 4, 6];
const views: SchedulerTypes.Properties['views'] = ['week', 'workWeek', 'month', 'timelineWeek', 'agenda'];
const currentDate = new Date(2021, 3, 26);
const VALIDATION_MESSAGE = 'The hiddenWeekDays option cannot hide all days of the week. At least one day must remain visible.';

const App = () => {
  const [visibleDays, setVisibleDays] = useState<SchedulerTypes.DayOfWeek[]>(defaultVisible);

  const isInvalid = visibleDays.length === 0;

  const hiddenWeekDays = useMemo(
    () => allDays.filter((d) => !visibleDays.includes(d)),
    [visibleDays],
  );

  const onDayToggle = useCallback((dayIndex: SchedulerTypes.DayOfWeek, e: CheckBoxTypes.ValueChangedEvent) => {
    setVisibleDays((prev) => (e.value
      ? [...prev, dayIndex]
      : prev.filter((d) => d !== dayIndex)));
  }, []);

  return (
    <div className={`hidden-days-demo${isInvalid ? ' is-invalid' : ''}`}>
      <div className="scheduler-container">
        <Scheduler
          timeZone="America/Los_Angeles"
          dataSource={dataSource}
          views={views}
          hiddenWeekDays={hiddenWeekDays}
          defaultCurrentView="week"
          defaultCurrentDate={currentDate}
          startDayHour={9}
          height={730}
        />
      </div>
      <div className="options">
        <div className="caption">Visible Week Days</div>
        {dayLabels.map((label, idx) => (
          <div className="option" key={label}>
            <CheckBox
              text={label}
              value={visibleDays.includes(idx as SchedulerTypes.DayOfWeek)}
              onValueChanged={(e) => onDayToggle(idx as SchedulerTypes.DayOfWeek, e)}
            />
          </div>
        ))}
        <div className="validation-message">
          {VALIDATION_MESSAGE}
        </div>
      </div>
    </div>
  );
};

export default App;
