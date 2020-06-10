import React from 'react';

import Scheduler, { Resource } from 'devextreme-react/scheduler';
import SpeedDialAction from 'devextreme-react/speed-dial-action';

import { data, priorities } from './data.js';

const currentDate = new Date(2017, 4, 25);
const views = ['week', 'month'];

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scheduler: null
    };
    this.showAppointmentPopup = this.showAppointmentPopup.bind(this);
    this.onContentReady = this.onContentReady.bind(this);
  }

  render() {
    return (
      <React.Fragment>
        <Scheduler
          dataSource={data}
          views={views}
          adaptivityEnabled={true}
          onContentReady={this.onContentReady}
          defaultCurrentView="month"
          defaultCurrentDate={currentDate}
          height={590}
          startDayHour={9}>
          <Resource
            dataSource={priorities}
            fieldExpr="priorityId"
            label="Priority"
          />
        </Scheduler>
        <SpeedDialAction
          icon="plus"
          onClick={this.showAppointmentPopup}
        />
      </React.Fragment>
    );
  }

  onContentReady(e) {
    this.state.scheduler === null && this.setState({ scheduler: e.component });
  }

  showAppointmentPopup() {
    this.state.scheduler.showAppointmentPopup(this.createAppointmentPopupData());
  }

  createAppointmentPopupData() {
    const currentDate = this.state.scheduler.option('currentDate');
    const cellDuration = this.state.scheduler.option('cellDuration');
    return {
      startDate: new Date(currentDate),
      endDate: new Date(currentDate.setMinutes(cellDuration))
    };
  }
}

export default App;
