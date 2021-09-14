import React from 'react';
import Gantt, {
  Tasks, Dependencies, Resources, ResourceAssignments, Column, Editing,
} from 'devextreme-react/gantt';
import CheckBox from 'devextreme-react/check-box';
import SelectBox from 'devextreme-react/select-box';
import DateBox from 'devextreme-react/date-box';
import {
  tasks, dependencies, resources, resourceAssignments,
} from './data.js';
import TaskTooltipTemplate from './TaskTooltipTemplate.js';
import TaskProgressTooltipContentTemplate from './TaskProgressTooltipContentTemplate.js';
import TaskTimeTooltipContentTemplate from './TaskTimeTooltipContentTemplate.js';

const scaleTypes = ['auto', 'minutes', 'hours', 'days', 'weeks', 'months', 'quarters', 'years'];
const titlePositions = ['inside', 'outside', 'none'];

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      scaleType: 'months',
      taskTitlePosition: 'outside',
      showResources: true,
      showDependencies: true,
      showCustomTaskTooltip: true,
      startDateRange: new Date(2018, 11, 1),
      endDateRange: new Date(2019, 11, 1),
    };
    this.onScaleTypeChanged = this.onScaleTypeChanged.bind(this);
    this.onTaskTitlePositionChanged = this.onTaskTitlePositionChanged.bind(this);
    this.onShowResourcesChanged = this.onShowResourcesChanged.bind(this);
    this.onShowDependenciesChanged = this.onShowDependenciesChanged.bind(this);
    this.onShowCustomTaskTooltip = this.onShowCustomTaskTooltip.bind(this);
    this.onStartDateValueChanged = this.onStartDateValueChanged.bind(this);
    this.onEndDateValueChanged = this.onEndDateValueChanged.bind(this);
  }

  render() {
    const {
      scaleType,
      taskTitlePosition,
      showResources,
      showDependencies,
      showCustomTaskTooltip,
      startDateRange,
      endDateRange,
    } = this.state;
    return (
      <div id="form-demo">
        <div className="options">
          <div className="caption">Options</div>
          <div className="column">
            <div className="option">
              <div className="label">Scale Type:</div>
              {' '}
              <div className="value">
                <SelectBox
                  items={scaleTypes}
                  value={scaleType}
                  onValueChanged={this.onScaleTypeChanged}
                />
              </div>
            </div>
            <div className="option">
              <div className="label">Title Position:</div>
              {' '}
              <div className="value">
                <SelectBox
                  items={titlePositions}
                  value={taskTitlePosition}
                  onValueChanged={this.onTaskTitlePositionChanged}
                />
              </div>
            </div>
            <div className="option">
              <div className="label">Show Resources:</div>
              {' '}
              <div className="value">
                <CheckBox
                  value={showResources}
                  onValueChanged={this.onShowResourcesChanged}
                />
              </div>
            </div>
            <div className="option">
              <div className="label">Show Dependencies:</div>
              {' '}
              <div className="value">
                <CheckBox
                  value={showDependencies}
                  onValueChanged={this.onShowDependenciesChanged}
                />
              </div>
            </div>
          </div>
          {' '}
          <div className="column">
            <div className="option">
              <div className="label">Start Date Range:</div>
              {' '}
              <div className="value">
                <DateBox
                  value={startDateRange}
                  type="date"
                  onValueChanged={this.onStartDateValueChanged}
                />
              </div>
            </div>
            <div className="option">
              <div className="label">End Date Range:</div>
              {' '}
              <div className="value">
                <DateBox
                  value={endDateRange}
                  type="date"
                  onValueChanged={this.onEndDateValueChanged}
                />
              </div>
            </div>
            <div className="option">
              <div className="label">Customize Task Tooltip:</div>
              {' '}
              <div className="value">
                <CheckBox
                  value={showCustomTaskTooltip}
                  onValueChanged={this.onShowCustomTaskTooltip}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="widget-container">
          <Gantt
            taskListWidth={500}
            height={700}
            taskTitlePosition={taskTitlePosition}
            scaleType={scaleType}
            showResources={showResources}
            showDependencies={showDependencies}
            taskTooltipContentRender = {showCustomTaskTooltip ? TaskTooltipTemplate : undefined}
            taskTimeTooltipContentRender =
              {showCustomTaskTooltip ? TaskTimeTooltipContentTemplate : undefined}
            taskProgressTooltipContentRender =
              {showCustomTaskTooltip ? TaskProgressTooltipContentTemplate : undefined}
            startDateRange = {startDateRange}
            endDateRange = {endDateRange}>

            <Tasks dataSource={tasks} />
            <Dependencies dataSource={dependencies} />
            <Resources dataSource={resources} />
            <ResourceAssignments dataSource={resourceAssignments} />

            <Column dataField="title" caption="Subject" width={300} />
            <Column dataField="start" caption="Start Date" />
            <Column dataField="end" caption="End Date" />

            <Editing enabled={true} />
          </Gantt>
        </div>
      </div>
    );
  }

  onScaleTypeChanged(e) {
    this.setState({
      scaleType: e.value,
    });
  }

  onTaskTitlePositionChanged(e) {
    this.setState({
      taskTitlePosition: e.value,
    });
  }

  onShowResourcesChanged(e) {
    this.setState({
      showResources: e.value,
    });
  }

  onShowDependenciesChanged(e) {
    this.setState({
      showDependencies: e.value,
    });
  }

  onShowCustomTaskTooltip(e) {
    this.setState({
      showCustomTaskTooltip: e.value,
    });
  }

  onStartDateValueChanged(e) {
    this.setState({
      startDateRange: e.value,
    });
  }

  onEndDateValueChanged(e) {
    this.setState({
      endDateRange: e.value,
    });
  }
}

export default App;
