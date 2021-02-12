import React from 'react';

import Gantt, { Tasks, Dependencies, Resources, ResourceAssignments, Column, Editing, Toolbar, Item } from 'devextreme-react/gantt';
import { Popup } from 'devextreme-react/popup';

import { tasks, dependencies, resources, resourceAssignments } from './data.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      popupVisible: false
    };
    this.aboutButtonOptions = {
      text: 'About',
      icon: 'info',
      stylingMode: 'text',
      onClick: this.aboutButtonClick.bind(this)
    };
  }
  render() {
    return (
      <React.Fragment>
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
            <Item name="separator" />
            <Item widget="dxButton" options={this.aboutButtonOptions} />
          </Toolbar>

          <Column dataField="title" caption="Subject" width={300} />
          <Column dataField="start" caption="Start Date" />
          <Column dataField="end" caption="End Date" />

          <Editing enabled={true} />
        </Gantt>
        <Popup
          visible={this.state.popupVisible}
          closeOnOutsideClick={true}
          showTitle={true}
          title="About"
          height="auto"
        >
          <div>
            The DevExtreme JavaScript <b>Gantt</b> allows you to display the task flow and dependencies between tasks over a certain period.
            <br />
            <br />
            You can move and modify tasks (a task name, duration or progress, for example) directly from the chart.
            Adjust the timescale to display tasks in smaller or greater time intervals, from hours to years.
            Hold the CTRL key and rotate your mouse&apos;s scroll wheel to zoom (in or out) to browse data across various levels of detail.
          </div>
        </Popup>
      </React.Fragment>
    );
  }
  aboutButtonClick() {
    this.setState({
      popupVisible: true
    });
  }
}

export default App;
