import React from 'react';

import Scheduler, { Resource } from 'devextreme-react/scheduler';

import RadioGroup from 'devextreme-react/radio-group';

import { data, owners, rooms, priorities, resourcesList } from './data.js';

const currentDate = new Date(2021, 4, 25);
const views = ['workWeek'];

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      radioGroupValue: resourcesList[0]
    };
    this.onRadioGroupValueChanged = this.onRadioGroupValueChanged.bind(this);
  }

  render() {
    return (
      <React.Fragment>
        <Scheduler
          timeZone="America/Los_Angeles"
          dataSource={data}
          views={views}
          defaultCurrentView="workWeek"
          defaultCurrentDate={currentDate}
          startDayHour={9}
          endDayHour={19}
          height={600}
        >
          <Resource
            dataSource={rooms}
            allowMultiple={true}
            fieldExpr="roomId"
            label="Room"
            useColorAsDefault={this.state.radioGroupValue === 'Room'}
          />
          <Resource
            dataSource={priorities}
            allowMultiple={true}
            fieldExpr="priorityId"
            label="Priority"
            useColorAsDefault={this.state.radioGroupValue === 'Priority'}
          />
          <Resource
            dataSource={owners}
            allowMultiple={true}
            fieldExpr="ownerId"
            label="Owner"
            useColorAsDefault={this.state.radioGroupValue === 'Owner'}
          />
        </Scheduler>
        <div className="options">
          <div className="caption">Use colors of:</div>
          <div className="option">
            <RadioGroup
              items={resourcesList}
              value={this.state.radioGroupValue}
              layout="horizontal"
              onValueChanged={this.onRadioGroupValueChanged}
            />
          </div>
        </div>
      </React.Fragment>
    );
  }

  onRadioGroupValueChanged(args) {
    this.setState({
      radioGroupValue: args.value
    });
  }
}

export default App;
