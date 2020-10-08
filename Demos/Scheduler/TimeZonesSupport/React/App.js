import React from 'react';
import Scheduler, { Editing } from 'devextreme-react/scheduler';
import SelectBox from 'devextreme-react/select-box';

import { data, locations } from './data.js';

const currentDate = new Date(2021, 4, 25);

const views = ['workWeek'];

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timeZone: locations[0].timeZoneId
    };
    this.onValueChanged = this.onValueChanged.bind(this);
  }

  render() {
    const { timeZone } = this.state;
    return (
      <React.Fragment>
        <div className="option">
          <span>Office Time Zone</span>
          <SelectBox
            items={locations}
            displayExpr="text"
            valueExpr="timeZoneId"
            width={240}
            value={timeZone}
            onValueChanged={this.onValueChanged}
          />
        </div>
        <Scheduler
          dataSource={data}
          views={views}
          defaultCurrentView="workWeek"
          defaultCurrentDate={currentDate}
          timeZone={timeZone}
          height={600}
        >
          <Editing
            allowTimeZoneEditing={true}
          />
        </Scheduler>
      </React.Fragment>
    );
  }

  onValueChanged(e) {
    this.setState({
      timeZone: e.value
    });
  }
}

export default App;
