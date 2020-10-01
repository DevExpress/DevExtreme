import React from 'react';

import Switch from 'devextreme-react/switch';
import Scheduler, { Resource, View } from 'devextreme-react/scheduler';

import { data, priorityData } from './data.js';

const currentDate = new Date(2021, 4, 21);
const views = [{
  type: 'week',
  name: 'Week'
}, {
  type: 'month',
  name: 'Month'
}];

const groups = ['priorityId'];

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      groupByDate: true
    };
    this.onGroupByDateChanged = this.onGroupByDateChanged.bind(this);
  }

  onGroupByDateChanged(args) {
    this.setState({
      groupByDate: args.value
    });
  }
  render() {
    return (
      <div id="scheduler">
        <Scheduler
          dataSource={data}
          views={views}
          groups={groups}
          groupByDate={this.state.groupByDate}
          defaultCurrentView="week"
          defaultCurrentDate={currentDate}
          height={700}
          startDayHour={9}
          endDayHour={16}
          crossScrollingEnabled={true}>
          <Resource
            fieldExpr="priorityId"
            allowMultiple={false}
            dataSource={priorityData}
            label="Priority"
          />
          <View
            type="week"
            name="Week"
          />
          <View
            type="month"
            name="Month"
          />
          <View
            type="timelineWeek"
            name="Timeline Week"
            groupOrientation="horizontal"
            cellDuration={60}
          />
        </Scheduler>
        <div className="options">
          <div className="caption">Group by Date First</div>
          <div className="option">
            <Switch
              value={ this.state.groupByDate }
              onValueChanged={this.onGroupByDateChanged}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
