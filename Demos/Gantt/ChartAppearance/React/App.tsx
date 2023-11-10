import React from 'react';
import Gantt, {
  Tasks, Dependencies, Resources, ResourceAssignments, Column, Editing, IGanttOptions,
} from 'devextreme-react/gantt';
import CheckBox, { ICheckBoxOptions } from 'devextreme-react/check-box';
import SelectBox, { ISelectBoxOptions } from 'devextreme-react/select-box';
import DateBox, { IDateBoxOptions } from 'devextreme-react/date-box';
import {
  tasks, dependencies, resources, resourceAssignments, startDateLabel, endDateLabel,
} from './data.ts';
import TaskTooltipTemplate from './TaskTooltipTemplate.tsx';
import TaskProgressTooltipContentTemplate from './TaskProgressTooltipContentTemplate.tsx';
import TaskTimeTooltipContentTemplate from './TaskTimeTooltipContentTemplate.tsx';

const scaleTypes = ['auto', 'minutes', 'hours', 'days', 'weeks', 'months', 'quarters', 'years'];
const titlePositions = ['inside', 'outside', 'none'];
export const scaleTypeLabel = { 'aria-label': 'Scale Type' };
export const titlePositionLabel = { 'aria-label': 'Title Position' };

const taskTitlePosition: IGanttOptions['taskTitlePosition'] = 'outside';
const scaleType: IGanttOptions['scaleType'] = 'months';
const initialGanttConfig = {
  scaleType,
  taskTitlePosition,
  showResources: true,
  showDependencies: true,
  showCustomTaskTooltip: true,
  startDateRange: new Date(2018, 11, 1),
  endDateRange: new Date(2019, 11, 1),
};

function App() {
  const [ganttConfig, setGanttConfig] = React.useState(initialGanttConfig);
  const updateGanttConfig = (value: Partial<typeof initialGanttConfig>) => setGanttConfig({
    ...ganttConfig,
    ...value,
  });
  const onScaleTypeChanged: ISelectBoxOptions['onValueChanged'] = ({ value }) => updateGanttConfig({ scaleType: value });
  const onTaskTitlePositionChanged: ISelectBoxOptions['onValueChanged'] = ({ value }) => updateGanttConfig({ taskTitlePosition: value });
  const onShowResourcesChanged: ICheckBoxOptions['onValueChanged'] = ({ value }) => updateGanttConfig({ showResources: value });
  const onShowDependenciesChanged: ICheckBoxOptions['onValueChanged'] = ({ value }) => updateGanttConfig({ showDependencies: value });
  const onShowCustomTaskTooltip: ICheckBoxOptions['onValueChanged'] = ({ value }) => updateGanttConfig({ showCustomTaskTooltip: value });
  const onStartDateValueChanged: IDateBoxOptions['onValueChange'] = ({ value }) => updateGanttConfig({ startDateRange: value });
  const onEndDateValueChanged: IDateBoxOptions['onValueChange'] = ({ value }) => updateGanttConfig({ endDateRange: value });

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
                inputAttr={scaleTypeLabel}
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
                inputAttr={titlePositionLabel}
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
}
export default App;
