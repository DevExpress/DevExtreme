import React from 'react';

import Scheduler, { Resource } from 'devextreme-react/scheduler';
import SpeedDialAction from 'devextreme-react/speed-dial-action';

import { data, priorities } from './data.js';

const views = ['week', 'month'];

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentDate: new Date(2021, 2, 25),
      cellDuration: 30,
    };
    this.showAppointmentPopup = this.showAppointmentPopup.bind(this);
    this.onOptionChanged = this.onOptionChanged.bind(this);

    this.schedulerRef = React.createRef();
  }

  render() {
    return (
      <React.Fragment>
        <Scheduler
          ref={this.schedulerRef}
          timeZone="America/Los_Angeles"
          dataSource={data}
          views={views}
          adaptivityEnabled={true}
          onOptionChanged={this.onOptionChanged}
          defaultCurrentView="month"
          currentDate={this.state.currentDate}
          cellDuration={this.state.cellDuration}
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

  onOptionChanged(e) {
    if (e.name === 'currentDate') {
      this.setState({ currentDate: e.value });
    }
  }

  showAppointmentPopup() {
    this.schedulerRef.current.instance.showAppointmentPopup();
  }
}

export default App;
