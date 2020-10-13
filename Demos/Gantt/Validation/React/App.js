import React from 'react';
import Gantt, { Tasks, Dependencies, Column, Validation, Editing } from 'devextreme-react/gantt';
import CheckBox from 'devextreme-react/check-box';
import { tasks, dependencies } from './data.js';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      autoUpdateParentTasks: true,
      validateDependencies: true
    };
    this.onAutoUpdateParentTasksChanged = this.onAutoUpdateParentTasksChanged.bind(this);
    this.onValidateDependenciesChanged = this.onValidateDependenciesChanged.bind(this);
  }

  render() {
    const {
      autoUpdateParentTasks,
      validateDependencies
    } = this.state;
    return (
      <div id="form-demo">
        <div className="options">
          <div className="caption">Options</div>
          <div className="option">
            <CheckBox
              text="Auto Update Parent Tasks"
              value={autoUpdateParentTasks}
              onValueChanged={this.onAutoUpdateParentTasksChanged}
            />
          </div>
          &nbsp;
          <div className="option">
            <CheckBox
              text="Enable Dependency Validation"
              value={validateDependencies}
              onValueChanged={this.onValidateDependenciesChanged}
            />
          </div>
        </div>
        <div className="widget-container">
          <Gantt
            taskListWidth={500}
            height={700}
            taskTitlePosition="none">

            <Validation autoUpdateParentTasks={autoUpdateParentTasks} validateDependencies={validateDependencies} />

            <Tasks dataSource={tasks} />
            <Dependencies dataSource={dependencies} />

            <Column dataField="title" caption="Task" width={300} />
            <Column dataField="start" caption="Start Date" />
            <Column dataField="end" caption="End Date" />

            <Editing enabled={true} />
          </Gantt>
        </div>
      </div>
    );
  }

  onAutoUpdateParentTasksChanged(e) {
    this.setState({
      autoUpdateParentTasks: e.value
    });
  }
  onValidateDependenciesChanged(e) {
    this.setState({
      validateDependencies: e.value
    });
  }
}

export default App;
