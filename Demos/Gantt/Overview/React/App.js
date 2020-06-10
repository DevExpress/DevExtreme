import React from 'react';

import Gantt, { Tasks, Dependencies, Resources, ResourceAssignments, Column, Editing, Toolbar, Item, Validation } from 'devextreme-react/gantt';

import { tasks, dependencies, resources, resourceAssignments } from './data.js';

class App extends React.Component {
  render() {
    return (
      <Gantt
        taskListWidth={500}
        scaleType="weeks"
        height={700}>

        <Tasks dataSource={tasks} />
        <Dependencies dataSource={dependencies} />
        <Resources dataSource={resources} />
        <ResourceAssignments dataSource={resourceAssignments} />

        <Toolbar>
          <Item name="undo" />
          <Item name="redo" />
          <Item name="separator" />
          <Item name="collapseAll" />
          <Item name="expandAll" />
          <Item name="separator" />
          <Item name="addTask" />
          <Item name="deleteTask" />
          <Item name="separator" />
          <Item name="zoomIn" />
          <Item name="zoomOut" />
        </Toolbar>

        <Column dataField="title" caption="Subject" width={300} />
        <Column dataField="start" caption="Start Date" />
        <Column dataField="end" caption="End Date" />

        <Validation autoUpdateParentTasks={true} />
        <Editing enabled={true} />
      </Gantt>
    );
  }
}

export default App;
