import React from 'react';
import Scheduler, { Editing } from 'devextreme-react/scheduler';
import SelectBox from 'devextreme-react/select-box';

import timeZoneUtils from 'devextreme/time_zone_utils';
import { data, locations, timeZoneLabel } from './data.js';

const currentDate = new Date(2021, 3, 27);
const views = ['workWeek'];

function getLocations(date) {
  const timeZones = timeZoneUtils.getTimeZones(date);
  return timeZones.filter((timeZone) => locations.indexOf(timeZone.id) !== -1);
}

const demoLocations = getLocations(currentDate);

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timeZone: demoLocations[0].id,
      demoLocations,
    };
    this.onValueChanged = this.onValueChanged.bind(this);
    this.onAppointmentFormOpening = this.onAppointmentFormOpening.bind(this);
    this.onOptionChanged = this.onOptionChanged.bind(this);
  }

  onValueChanged(e) {
    this.setState({
      timeZone: e.value,
    });
  }

  onAppointmentFormOpening(e) {
    const { form } = e;

    const startDateTimezoneEditor = form.getEditor('startDateTimeZone');
    const endDateTimezoneEditor = form.getEditor('endDateTimeZone');
    const startDateDataSource = startDateTimezoneEditor.option('dataSource');
    const endDateDataSource = endDateTimezoneEditor.option('dataSource');

    startDateDataSource.filter(['id', 'contains', 'Europe']);
    endDateDataSource.filter(['id', 'contains', 'Europe']);

    startDateDataSource.load();
    endDateDataSource.load();
  }

  onOptionChanged(e) {
    if (e.name === 'currentDate') {
      this.setState({
        demoLocations: getLocations(e.value),
      });
    }
  }

  render() {
    const { timeZone } = this.state;
    return (
      <React.Fragment>
        <div className="option">
          <span>Office Time Zone</span>
          <SelectBox
            items={this.state.demoLocations}
            displayExpr="title"
            valueExpr="id"
            inputAttr={timeZoneLabel}
            width={240}
            value={timeZone}
            onValueChanged={this.onValueChanged}
          />
        </div>
        <Scheduler
          dataSource={data}
          views={views}
          defaultCurrentView="workWeek"
          startDayHour={8}
          defaultCurrentDate={currentDate}
          timeZone={timeZone}
          height={600}
          onAppointmentFormOpening={this.onAppointmentFormOpening}
          onOptionChanged={this.onOptionChanged}
        >
          <Editing
            allowTimeZoneEditing={true}
          />
        </Scheduler>
      </React.Fragment>
    );
  }
}

export default App;
