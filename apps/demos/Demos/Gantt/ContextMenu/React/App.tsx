import React, { useState } from 'react';
import Gantt, {
  Tasks, Dependencies, Resources, ResourceAssignments, Column, Editing, ContextMenu,
} from 'devextreme-react/gantt';
import type { IContextMenuProps } from 'devextreme-react/gantt';
import CheckBox from 'devextreme-react/check-box';
import type { ICheckBoxOptions } from 'devextreme-react/check-box';
import type { ContextMenuPreparingEvent } from 'devextreme/ui/gantt';
import {
  tasks, dependencies, resources, resourceAssignments,
} from './data.ts';

function App() {
  const [ganttConfig, setGanttConfig] = useState({
    showResources: true,
    disableContextMenu: false,
    contextMenuItems: getContextMenuItems(),
  });
  const onCustomizeContextMenu: ICheckBoxOptions['onValueChanged'] = ({ value }) => {
    setGanttConfig({
      ...ganttConfig,
      contextMenuItems: value ? getContextMenuItems() : undefined,
    });
  };

  const onPreventContextMenuShowing: ICheckBoxOptions['onValueChanged'] = ({ value }) => {
    setGanttConfig({
      ...ganttConfig,
      disableContextMenu: value,
    });
  };

  return (
    <div id="form-demo">
      <div className="options">
        <div className="caption">Options</div>
        <div className="option">
          <CheckBox
            text="Prevent Context Menu Showing"
            value={ganttConfig.disableContextMenu}
            onValueChanged={onPreventContextMenuShowing}
          />
        </div>
          &nbsp;
        <div className="option">
          <CheckBox
            text="Customize Context Menu"
            defaultValue={true}
            onValueChanged={onCustomizeContextMenu}
          />
        </div>
      </div>
      <div className="widget-container">
        <Gantt
          taskListWidth={500}
          height={700}
          showResources={ganttConfig.showResources}
          scaleType="weeks"
          onCustomCommand={onCustomCommandClick}
          onContextMenuPreparing={onContextMenuPreparing}
        >
          <ContextMenu
            items={ganttConfig.contextMenuItems} />

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

  function onContextMenuPreparing(e: ContextMenuPreparingEvent) {
    e.cancel = ganttConfig.disableContextMenu;
  }

  function onCustomCommandClick(e: { name: string; }) {
    if (e.name === 'ToggleDisplayOfResources') {
      setGanttConfig({
        ...ganttConfig,
        showResources: !ganttConfig.showResources,
      });
    }
  }

  function getContextMenuItems(): IContextMenuProps['items'] {
    return [
      'addTask',
      'taskDetails',
      'deleteTask',
      {
        name: 'ToggleDisplayOfResources',
        text: 'Toggle Display of Resources',
      },
    ];
  }
}

export default App;
