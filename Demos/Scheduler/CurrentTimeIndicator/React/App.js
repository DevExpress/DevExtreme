import React from 'react';
import Scheduler, { Resource } from 'devextreme-react/scheduler';
import { Switch } from 'devextreme-react/switch';
import { NumberBox } from 'devextreme-react/number-box';

import { data, moviesData } from './data.js';
import AppointmentTemplate from './AppointmentTemplate.js';

const currentDate = new Date();
const views = ['week', 'timelineWeek'];

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showCurrentTimeIndicator: true,
      shadeUntilCurrentTime: true,
      updateInterval: 10
    };
    this.onShowCurrentTimeIndicatorChanged = this.onShowCurrentTimeIndicatorChanged.bind(this);
    this.onShadeUntilCurrentTimeChanged = this.onShadeUntilCurrentTimeChanged.bind(this);
    this.onUpdateIntervalChanged = this.onUpdateIntervalChanged.bind(this);
    this.onContentReady = this.onContentReady.bind(this);
  }

  render() {
    return (
      <React.Fragment>
        <Scheduler
          dataSource={data}
          views={views}
          defaultCurrentView="week"
          showCurrentTimeIndicator={this.state.showCurrentTimeIndicator}
          showAllDayPanel={false}
          shadeUntilCurrentTime={this.state.shadeUntilCurrentTime}
          defaultCurrentDate={currentDate}
          editing={false}
          height={600}
          appointmentRender={AppointmentTemplate}
          onContentReady={this.onContentReady}
          onAppointmentClick={this.onAppointmentClick}
          onAppointmentDblClick={this.onAppointmentDblClick}
        >
          <Resource
            dataSource={moviesData}
            fieldExpr="movieId"
          />
        </Scheduler>
        <div className="options">
          <div className="column">
            <div className="option">
              <div className="label">Current time indicator </div>
              {' '}
              <div className="value">
                <Switch
                  id="show-indicator"
                  value={this.state.showCurrentTimeIndicator}
                  onValueChanged={this.onShowCurrentTimeIndicatorChanged}
                />
              </div>
            </div>
            <div className="option">
              <div className="label">Shading until current time </div>
              {' '}
              <div className="value">
                <Switch
                  id="allow-shading"
                  value={this.state.shadeUntilCurrentTime}
                  onValueChanged={this.onShadeUntilCurrentTimeChanged}
                />
              </div>
            </div>
          </div>
          {' '}
          <div className="column">
            <div className="option">
              <div className="label">Update position in </div>
              {' '}
              <div className="value">
                <NumberBox
                  min={1}
                  max={1200}
                  value={this.state.updateInterval}
                  step={10}
                  showSpinButtons={true}
                  width={100}
                  format="#0 s"
                  onValueChanged={this.onUpdateIntervalChanged}
                />
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }

  onContentReady(e) {
    const currentHour = new Date().getHours() - 1;
    e.component.scrollToTime(currentHour, 30, new Date());
  }

  onAppointmentClick(e) {
    e.cancel = true;
  }

  onAppointmentDblClick(e) {
    e.cancel = true;
  }

  onShowCurrentTimeIndicatorChanged(e) {
    this.setState({ showCurrentTimeIndicator: e.value });
  }

  onShadeUntilCurrentTimeChanged(e) {
    this.setState({ shadeUntilCurrentTime: e.value });
  }

  onUpdateIntervalChanged(args) {
    this.setState({ updateInterval: args.value });
  }
}

export default App;
