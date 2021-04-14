import React from 'react';
import Gantt, { Tasks, Dependencies, Resources, ResourceAssignments, Column, Editing } from 'devextreme-react/gantt';
import { tasks, dependencies, resources, resourceAssignments } from './data.js';
import TaskTemplate from './TaskTemplate.js';

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div id="form-demo">
        <div className="widget-container">
          <Gantt
            taskListWidth={500}
            height={700}
            scaleType="days"
            taskContentRender={TaskTemplate}>

            <Tasks dataSource={tasks} />
            <Dependencies dataSource={dependencies} />
            <Resources dataSource={resources} />
            <ResourceAssignments dataSource={resourceAssignments} />

            <Column dataField="title" caption="Subject" width={300} />
            <Column dataField="start" caption="Start Date" />
            <Column dataField="end" caption="End Date" />

            <Editing enabled={false} />
          </Gantt>
        </div>
      </div>
    );
  }
}

export default App;
