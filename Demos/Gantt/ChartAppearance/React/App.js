import React from 'react';
import Gantt, { Tasks, Dependencies, Resources, ResourceAssignments, Column, Editing } from 'devextreme-react/gantt';
import CheckBox from 'devextreme-react/check-box';
import SelectBox from 'devextreme-react/select-box';
import { tasks, dependencies, resources, resourceAssignments } from './data.js';
import TaskTooltipTemplate from './TaskTooltipTemplate.js';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      scaleType: 'months',
      taskTitlePosition: 'outside',
      showResources: true,
      showCustomTaskTooltip: true
    };
    this.onScaleTypeChanged = this.onScaleTypeChanged.bind(this);
    this.onTaskTitlePositionChanged = this.onTaskTitlePositionChanged.bind(this);
    this.onShowResourcesChanged = this.onShowResourcesChanged.bind(this);
    this.onShowCustomTaskTooltip = this.onShowCustomTaskTooltip.bind(this);
  }

  render() {
    const {
      scaleType,
      taskTitlePosition,
      showResources,
      showCustomTaskTooltip
    } = this.state;
    return (
      <div id="form-demo">
        <div className="options">
          <div className="caption">Options</div>
          <div className="option">
            <span>Scale Type</span>
            <SelectBox
              items={['auto', 'minutes', 'hours', 'days', 'weeks', 'months', 'quarters', 'years']}
              value={scaleType}
              onValueChanged={this.onScaleTypeChanged}
            />
          </div>
          &nbsp;
          <div className="option">
            <span>Title Position</span>
            <SelectBox
              items={['inside', 'outside', 'none']}
              value={taskTitlePosition}
              onValueChanged={this.onTaskTitlePositionChanged}
            />
          </div>
          &nbsp;
          <div className="option">
            <CheckBox
              text="Show Resources"
              value={showResources}
              onValueChanged={this.onShowResourcesChanged}
            />
          </div>
          &nbsp;
          <div className="option">
            <CheckBox
              text="Customize Task Tooltip"
              value={showCustomTaskTooltip}
              onValueChanged={this.onShowCustomTaskTooltip}
            />
          </div>
        </div>
        <div className="widget-container">
          <Gantt
            taskListWidth={500}
            height={700}
            taskTitlePosition={taskTitlePosition}
            scaleType={scaleType}
            showResources={showResources}
            taskTooltipContentRender = {showCustomTaskTooltip ? TaskTooltipTemplate : undefined}>

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
      scaleType: e.value
    });
  }
  onTaskTitlePositionChanged(e) {
    this.setState({
      taskTitlePosition: e.value
    });
  }
  onShowResourcesChanged(e) {
    this.setState({
      showResources: e.value
    });
  }
  onShowCustomTaskTooltip(e) {
    this.setState({
      showCustomTaskTooltip: e.value
    });
  }
}

export default App;
