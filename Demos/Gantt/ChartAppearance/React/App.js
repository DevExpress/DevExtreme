import React from 'react';
import Gantt, {
  Tasks, Dependencies, Resources, ResourceAssignments, Column, Editing,
} from 'devextreme-react/gantt';
import CheckBox from 'devextreme-react/check-box';
import SelectBox from 'devextreme-react/select-box';
import DateBox from 'devextreme-react/date-box';
import {
  tasks, dependencies, resources, resourceAssignments, startDateLabel, endDateLabel,
} from './data.js';
import TaskTooltipTemplate from './TaskTooltipTemplate.js';
import TaskProgressTooltipContentTemplate from './TaskProgressTooltipContentTemplate.js';
import TaskTimeTooltipContentTemplate from './TaskTimeTooltipContentTemplate.js';

const scaleTypes = ['auto', 'minutes', 'hours', 'days', 'weeks', 'months', 'quarters', 'years'];
const titlePositions = ['inside', 'outside', 'none'];

function App() {
  const [ganttConfig, setGanttConfig] = React.useState({
    scaleType: 'months',
    taskTitlePosition: 'outside',
    showResources: true,
    showDependencies: true,
    showCustomTaskTooltip: true,
    startDateRange: new Date(2018, 11, 1),
    endDateRange: new Date(2019, 11, 1),
  });

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
                value={ganttConfig.scaleType}
                onValueChanged={onScaleTypeChanged}
              />
            </div>
          </div>
          <div className="option">
            <div className="label">Title Position:</div>
            {' '}
            <div className="value">
              <SelectBox
                items={titlePositions}
                value={ganttConfig.taskTitlePosition}
                onValueChanged={onTaskTitlePositionChanged}
              />
            </div>
          </div>
          <div className="option">
            <div className="label">Show Resources:</div>
            {' '}
            <div className="value">
              <CheckBox
                value={ganttConfig.showResources}
                onValueChanged={onShowResourcesChanged}
              />
            </div>
          </div>
          <div className="option">
            <div className="label">Show Dependencies:</div>
            {' '}
            <div className="value">
              <CheckBox
                value={ganttConfig.showDependencies}
                onValueChanged={onShowDependenciesChanged}
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
                inputAttr={startDateLabel}
                value={ganttConfig.startDateRange}
                type="date"
                onValueChanged={onStartDateValueChanged}
              />
            </div>
          </div>
          <div className="option">
            <div className="label">End Date Range:</div>
            {' '}
            <div className="value">
              <DateBox
                inputAttr={endDateLabel}
                value={ganttConfig.endDateRange}
                type="date"
                onValueChanged={onEndDateValueChanged}
              />
            </div>
          </div>
          <div className="option">
            <div className="label">Customize Task Tooltip:</div>
            {' '}
            <div className="value">
              <CheckBox
                value={ganttConfig.showCustomTaskTooltip}
                onValueChanged={onShowCustomTaskTooltip}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="widget-container">
        <Gantt
          taskListWidth={500}
          height={700}
          taskTitlePosition={ganttConfig.taskTitlePosition}
          scaleType={ganttConfig.scaleType}
          showResources={ganttConfig.showResources}
          showDependencies={ganttConfig.showDependencies}
          taskTooltipContentRender =
            {ganttConfig.showCustomTaskTooltip ? TaskTooltipTemplate : undefined}
          taskTimeTooltipContentRender =
            {ganttConfig.showCustomTaskTooltip ? TaskTimeTooltipContentTemplate : undefined}
          taskProgressTooltipContentRender =
            {ganttConfig.showCustomTaskTooltip ? TaskProgressTooltipContentTemplate : undefined}
          startDateRange = {ganttConfig.startDateRange}
          endDateRange = {ganttConfig.endDateRange}>

          <Tasks dataSource={tasks} />
          <Dependencies dataSource={dependencies} />
          <Resources dataSource={resources} />
          <ResourceAssignments dataSource={resourceAssignments} />

          <Column dataField="title" caption="Subject" width={300} />
          <Column dataField="start" caption="Start Date" />
          <Column dataField="end" caption="End Date" />

          <Editing enabled />
        </Gantt>
      </div>
    </div>
  );

  function onScaleTypeChanged(e) {
    setGanttConfig({
      ...ganttConfig,
      scaleType: e.value,
    });
  }

  function onTaskTitlePositionChanged(e) {
    setGanttConfig({
      ...ganttConfig,
      taskTitlePosition: e.value,
    });
  }

  function onShowResourcesChanged(e) {
    setGanttConfig({
      ...ganttConfig,
      showResources: e.value,
    });
  }

  function onShowDependenciesChanged(e) {
    setGanttConfig({
      ...ganttConfig,
      showDependencies: e.value,
    });
  }

  function onShowCustomTaskTooltip(e) {
    setGanttConfig({
      ...ganttConfig,
      showCustomTaskTooltip: e.value,
    });
  }

  function onStartDateValueChanged(e) {
    setGanttConfig({
      ...ganttConfig,
      startDateRange: e.value,
    });
  }

  function onEndDateValueChanged(e) {
    setGanttConfig({
      ...ganttConfig,
      endDateRange: e.value,
    });
  }
}
export default App;
