import React from 'react';
import Gantt, {
  Tasks, Dependencies, Column, Validation, Editing,
} from 'devextreme-react/gantt';
import CheckBox from 'devextreme-react/check-box';
import { tasks, dependencies } from './data.js';

function App() {
  const [ganttConfig, setGanttConfig] = React.useState({
    autoUpdateParentTasks: true,
    validateDependencies: true,
    enablePredecessorGap: true,
  });

  return (
    <div id="form-demo">
      <div className="options">
        <div className="caption">Options</div>
        <div className="option">
          <CheckBox
            text="Auto Update Parent Tasks"
            value={ganttConfig.autoUpdateParentTasks}
            onValueChanged={onAutoUpdateParentTasksChanged}
          />
        </div>
        {' '}
        <div className="option">
          <CheckBox
            text="Enable Dependency Validation"
            value={ganttConfig.validateDependencies}
            onValueChanged={onValidateDependenciesChanged}
          />
        </div>
        {' '}
        <div className="option">
          <CheckBox
            text="Enable Predecessor Gap"
            value={ganttConfig.enablePredecessorGap}
            onValueChanged={onEnablePredecessorGapChanged}
          />
        </div>
      </div>
      <div className="widget-container">
        <Gantt
          taskListWidth={500}
          height={700}
          taskTitlePosition="none">

          <Validation
            autoUpdateParentTasks={ganttConfig.autoUpdateParentTasks}
            validateDependencies={ganttConfig.validateDependencies}
            enablePredecessorGap={ganttConfig.enablePredecessorGap} />

          <Tasks dataSource={tasks} />
          <Dependencies dataSource={dependencies} />

          <Column dataField="title" caption="Task" width={300} />
          <Column dataField="start" caption="Start Date" />
          <Column dataField="end" caption="End Date" />

          <Editing enabled />
        </Gantt>
      </div>
    </div>
  );

  function onAutoUpdateParentTasksChanged(e) {
    setGanttConfig({
      ...ganttConfig,
      autoUpdateParentTasks: e.value,
    });
  }

  function onValidateDependenciesChanged(e) {
    setGanttConfig({
      ...ganttConfig,
      validateDependencies: e.value,
    });
  }

  function onEnablePredecessorGapChanged(e) {
    setGanttConfig({
      ...ganttConfig,
      enablePredecessorGap: e.value,
    });
  }
}

export default App;
