import React from 'react';
import Scheduler, { Editing } from 'devextreme-react/scheduler';
import SelectBox from 'devextreme-react/select-box';

import timeZoneUtils from 'devextreme/time_zone_utils';
import { data, locations } from './data.js';

const timeZoneLabel = { 'aria-label': 'Time zone' };

const currentDate = new Date(2021, 3, 27);
const views = ['workWeek'];

const getTimeZones = (date) => {
  const timeZones = timeZoneUtils.getTimeZones(date);

  return timeZones.filter((timeZone) => locations.indexOf(timeZone.id) !== -1);
};

const defaultTimeZones = getTimeZones(currentDate);

const onAppointmentFormOpening = (e) => {
  const { form } = e;

  const startDateTimezoneEditor = form.getEditor('startDateTimeZone');
  const endDateTimezoneEditor = form.getEditor('endDateTimeZone');
  const startDateDataSource = startDateTimezoneEditor.option('dataSource');
  const endDateDataSource = endDateTimezoneEditor.option('dataSource');

  startDateDataSource.filter(['id', 'contains', 'Europe']);
  endDateDataSource.filter(['id', 'contains', 'Europe']);

  startDateDataSource.load();
  endDateDataSource.load();
};

const App = () => {
  const [currentTimeZone, setCurrentTimeZone] = React.useState(defaultTimeZones[0].id);
  const [timeZones, setTimeZones] = React.useState(defaultTimeZones);

  const onValueChanged = React.useCallback((e) => {
    setCurrentTimeZone(e.value);
  }, []);

  const onOptionChanged = React.useCallback((e) => {
    if (e.name === 'currentDate') {
      setTimeZones(getTimeZones(e.value));
    }
  }, []);

  return (
    <React.Fragment>
      <div className="option">
        <span>Office Time Zone</span>
        <SelectBox
          items={timeZones}
          displayExpr="title"
          valueExpr="id"
          inputAttr={timeZoneLabel}
          width={240}
          value={currentTimeZone}
          onValueChanged={onValueChanged}
        />
      </div>
      <Scheduler
        dataSource={data}
        views={views}
        defaultCurrentView="workWeek"
        startDayHour={8}
        defaultCurrentDate={currentDate}
        timeZone={currentTimeZone}
        height={600}
        onAppointmentFormOpening={onAppointmentFormOpening}
        onOptionChanged={onOptionChanged}
      >
        <Editing
          allowTimeZoneEditing={true}
        />
      </Scheduler>
    </React.Fragment>
  );
};

export default App;
