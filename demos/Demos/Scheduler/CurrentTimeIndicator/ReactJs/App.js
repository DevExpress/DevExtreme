import React, { useCallback, useState } from 'react';
import Scheduler, { Resource } from 'devextreme-react/scheduler';
import { Switch } from 'devextreme-react/switch';
import { NumberBox } from 'devextreme-react/number-box';
import { data, moviesData } from './data.js';
import AppointmentTemplate from './AppointmentTemplate.js';

const currentDate = new Date();
const views = ['week', 'timelineWeek'];
const intervalLabel = { 'aria-label': 'Interval' };
const onContentReady = (e) => {
  e.component.scrollTo(new Date());
};
const onAppointmentClick = (e) => {
  e.cancel = true;
};
const onAppointmentDblClick = (e) => {
  e.cancel = true;
};
const App = () => {
  const [showCurrentTimeIndicator, setShowCurrentTimeIndicator] = useState(true);
  const [shadeUntilCurrentTime, setShadeUntilCurrentTime] = useState(true);
  const [updateInterval, setUpdateInterval] = useState(10);
  const onShowCurrentTimeIndicatorChanged = useCallback((e) => {
    setShowCurrentTimeIndicator(e.value);
  }, []);
  const onShadeUntilCurrentTimeChanged = useCallback((e) => {
    setShadeUntilCurrentTime(e.value);
  }, []);
  const onUpdateIntervalChanged = useCallback((e) => {
    setUpdateInterval(e.value);
  }, []);
  return (
    <React.Fragment>
      <Scheduler
        dataSource={data}
        views={views}
        defaultCurrentView="week"
        showCurrentTimeIndicator={showCurrentTimeIndicator}
        indicatorUpdateInterval={updateInterval * 1000}
        showAllDayPanel={false}
        shadeUntilCurrentTime={shadeUntilCurrentTime}
        defaultCurrentDate={currentDate}
        editing={false}
        height={600}
        appointmentComponent={AppointmentTemplate}
        onContentReady={onContentReady}
        onAppointmentClick={onAppointmentClick}
        onAppointmentDblClick={onAppointmentDblClick}
      >
        <Resource
          dataSource={moviesData}
          fieldExpr="movieId"
        />
      </Scheduler>
      <div className="options">
        <div className="column">
          <div className="option">
            <div className="label">Current time indicator </div>{' '}
            <div className="value">
              <Switch
                id="show-indicator"
                value={showCurrentTimeIndicator}
                onValueChanged={onShowCurrentTimeIndicatorChanged}
              />
            </div>
          </div>
          <div className="option">
            <div className="label">Shading until current time </div>{' '}
            <div className="value">
              <Switch
                id="allow-shading"
                value={shadeUntilCurrentTime}
                onValueChanged={onShadeUntilCurrentTimeChanged}
              />
            </div>
          </div>
        </div>{' '}
        <div className="column">
          <div className="option">
            <div className="label">Update position in </div>{' '}
            <div className="value">
              <NumberBox
                min={1}
                max={1200}
                value={updateInterval}
                step={10}
                showSpinButtons={true}
                width={100}
                format="#0 s"
                inputAttr={intervalLabel}
                onValueChanged={onUpdateIntervalChanged}
              />
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
export default App;
