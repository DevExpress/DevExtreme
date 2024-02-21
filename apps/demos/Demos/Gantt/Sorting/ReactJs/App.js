import React, { useState } from 'react';
import Gantt, {
  Tasks,
  Dependencies,
  Resources,
  ResourceAssignments,
  Column,
  Editing,
  Sorting,
} from 'devextreme-react/gantt';
import CheckBox from 'devextreme-react/check-box';
import { SelectBox } from 'devextreme-react/select-box';
import {
  tasks, dependencies, resources, resourceAssignments, sortingModeLabel,
} from './data.js';

const sortingModeValues = ['single', 'multiple', 'none'];
const sortingMode = 'single';
function App() {
  const [ganttConfig, setGanttConfig] = useState({
    sortingMode,
    showSortIndexes: false,
    showSortIndexesDisabled: true,
  });
  const onSortingModeChanged = ({ value }) => {
    setGanttConfig({
      ...ganttConfig,
      sortingMode: value,
      showSortIndexesDisabled: value !== 'multiple',
    });
  };
  const onShowSortIndexesChanged = ({ value }) => {
    setGanttConfig({
      ...ganttConfig,
      showSortIndexes: value,
    });
  };
  return (
    <div id="form-demo">
      <div className="options">
        <div className="caption">Options</div>
        <div className="option">
          <div className="label">Sorting Mode:</div>{' '}
          <div className="value">
            <SelectBox
              items={sortingModeValues}
              inputAttr={sortingModeLabel}
              value={ganttConfig.sortingMode}
              onValueChanged={onSortingModeChanged}
            />
          </div>
        </div>{' '}
        <div className="option">
          <CheckBox
            text="Show Sort Indexes"
            value={ganttConfig.showSortIndexes}
            onValueChanged={onShowSortIndexesChanged}
            disabled={ganttConfig.showSortIndexesDisabled}
          />
        </div>
      </div>
      <div className="widget-container">
        <Gantt
          taskListWidth={500}
          scaleType="weeks"
          height={700}
          rootValue={-1}
        >
          <Tasks dataSource={tasks} />
          <Dependencies dataSource={dependencies} />
          <Resources dataSource={resources} />
          <ResourceAssignments dataSource={resourceAssignments} />

          <Column
            dataField="title"
            caption="Subject"
            width={300}
            sortOrder="asc"
          />
          <Column
            dataField="start"
            caption="Start Date"
          />
          <Column
            dataField="end"
            caption="End Date"
          />

          <Editing enabled />
          <Sorting
            mode={ganttConfig.sortingMode}
            showSortIndexes={ganttConfig.showSortIndexes}
          ></Sorting>
        </Gantt>
      </div>
    </div>
  );
}
export default App;
