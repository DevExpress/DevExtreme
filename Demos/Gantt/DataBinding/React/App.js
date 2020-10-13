import React from 'react';

import Gantt, { Tasks, Dependencies, Resources, ResourceAssignments, Column, Editing } from 'devextreme-react/gantt';

import { tasks, dependencies, resources, resourceAssignments } from './data.js';

class App extends React.Component {
  render() {
    return (
      <Gantt
        taskListWidth={500}
        scaleType="weeks"
        height={700}
        rootValue={-1}>

        <Tasks dataSource={tasks} />
        <Dependencies dataSource={dependencies} />
        <Resources dataSource={resources} />
        <ResourceAssignments dataSource={resourceAssignments} />

        <Column dataField="title" caption="Subject" width={300} />
        <Column dataField="start" caption="Start Date" />
        <Column dataField="end" caption="End Date" />

        <Editing enabled={true} />
      </Gantt>
    );
  }
}

export default App;
