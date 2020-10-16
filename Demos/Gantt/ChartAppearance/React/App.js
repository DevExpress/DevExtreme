import React from 'react';
import Gantt, { Tasks, Dependencies, Resources, ResourceAssignments, Column, Editing } from 'devextreme-react/gantt';
import CheckBox from 'devextreme-react/check-box';
import SelectBox from 'devextreme-react/select-box';
import { tasks, dependencies, resources, resourceAssignments } from './data.js';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      scaleType: 'quarters',
      taskTitlePosition: 'outside',
      showResources: true,
      taskTooltipContentTemplate: this.getTaskTooltipContentTemplate
    };
    this.onScaleTypeChanged = this.onScaleTypeChanged.bind(this);
    this.onTaskTitlePositionChanged = this.onTaskTitlePositionChanged.bind(this);
    this.onShowResourcesChanged = this.onShowResourcesChanged.bind(this);
    this.getTaskTooltipContentTemplate = this.getTaskTooltipContentTemplate.bind(this);
    this.onShowCustomTaskTooltip = this.onShowCustomTaskTooltip.bind(this);
  }

  render() {
    const {
      scaleType,
      taskTitlePosition,
      showResources,
      taskTooltipContentTemplate
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
              defaultValue={true}
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
            taskTooltipContentTemplate = {taskTooltipContentTemplate}>

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
    const parentELemnt = document.getElementsByClassName('dx-gantt-task-edit-tooltip')[0];
    parentELemnt.className = 'dx-gantt-task-edit-tooltip';
    this.setState({
      taskTooltipContentTemplate: e.value ? this.getTaskTooltipContentTemplate : undefined
    });
  }
  getTaskTooltipContentTemplate(model) {
    const parentELemnt = document.getElementsByClassName('dx-gantt-task-edit-tooltip')[0];
    parentELemnt.className = 'dx-gantt-task-edit-tooltip custom-task-edit-tooltip';
    const timeEstimate = Math.abs(model.start - model.end) / 36e5;
    const timeLeft = Math.floor((100 - model.progress) / 100 * timeEstimate);

    return `<div class="custom-tooltip-title"> ${model.title} </div>`
    + `<div class="custom-tooltip-row"> <span> Estimate: </span> ${timeEstimate} <span> hours </span> </div>`
    + `<div class="custom-tooltip-row"> <span> Left: </span> ${timeLeft} <span> hours </span> </div>`;
  }
}

export default App;
