import React from 'react';

import Gantt, {
  Tasks, Dependencies, Resources, ResourceAssignments, Column, Editing, Toolbar, Item,
} from 'devextreme-react/gantt';
import { Popup } from 'devextreme-react/popup';

import {
  tasks, dependencies, resources, resourceAssignments,
} from './data.ts';

function App() {
  const [ganttConfig, setGanttConfig] = React.useState({
    popupVisible: false,
  });

  const aboutButtonClick = React.useCallback(() => {
    setGanttConfig({
      ...ganttConfig,
      popupVisible: true,
    });
  }, [ganttConfig]);

  const getAboutButtonOptions = React.useCallback(() => ({
    text: 'About',
    icon: 'info',
    stylingMode: 'text',
    onClick: () => { aboutButtonClick(); },
  }), [aboutButtonClick]);

  const onHiding = React.useCallback(() => {
    setGanttConfig({
      ...ganttConfig,
      popupVisible: false,
    });
  }, [ganttConfig]);

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
          <Item name="showResources" />
          <Item name="showDependencies" />
          <Item name="separator" />
          <Item widget="dxButton" options={getAboutButtonOptions()} />
        </Toolbar>

        <Column dataField="title" caption="Subject" width={300} />
        <Column dataField="start" caption="Start Date" />
        <Column dataField="end" caption="End Date" />

        <Editing enabled />
      </Gantt>
      <Popup
        visible={ganttConfig.popupVisible}
        onHiding = {onHiding}
        hideOnOutsideClick
        showTitle
        title="About"
        height="auto"
      >
        <div>
            The DevExtreme JavaScript <b>Gantt</b> allows you to display the task
            flow and dependencies between tasks over a certain period.
          <br />
          <br />
            You can move and modify tasks (a task name, duration or progress, for example)
            directly from the chart. Adjust the timescale to display tasks in smaller or
            greater time intervals, from hours to years. Hold the CTRL key and rotate your
            mouse&apos;s scroll wheel to zoom (in or out) to browse data across various
            levels of detail.
        </div>
      </Popup>
    </React.Fragment>
  );
}

export default App;
