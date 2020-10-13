import React from 'react';
import Gantt, { Tasks, Dependencies, Resources, ResourceAssignments, Column, Editing, ContextMenu } from 'devextreme-react/gantt';
import CheckBox from 'devextreme-react/check-box';
import { tasks, dependencies, resources, resourceAssignments } from './data.js';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      showResources: true,
      disableContextMenu: false,
      contextMenuItems: this.getContextMenuItems()
    };
    this.onPreventContextMenuShowing = this.onPreventContextMenuShowing.bind(this);
    this.onCustomizeContextMenu = this.onCustomizeContextMenu.bind(this);
    this.onCustomCommandClick = this.onCustomCommandClick.bind(this);
    this.onContextMenuPreparing = this.onContextMenuPreparing.bind(this);
  }

  render() {
    const {
      showResources,
      disableContextMenu,
      contextMenuItems
    } = this.state;
    return (
      <div id="form-demo">
        <div className="options">
          <div className="caption">Options</div>
          <div className="option">
            <CheckBox
              text="Prevent Context Menu Showing"
              value={disableContextMenu}
              onValueChanged={this.onPreventContextMenuShowing}
            />
          </div>
          &nbsp;
          <div className="option">
            <CheckBox
              text="Customize Context Menu"
              defaultValue={true}
              onValueChanged={this.onCustomizeContextMenu}
            />
          </div>
        </div>
        <div className="widget-container">
          <Gantt
            taskListWidth={500}
            height={700}
            showResources={showResources}
            scaleType="weeks"
            onCustomCommand={this.onCustomCommandClick}
            onContextMenuPreparing={this.onContextMenuPreparing}
          >
            <ContextMenu
              items={contextMenuItems} />

            <Tasks dataSource={tasks} />
            <Dependencies dataSource={dependencies} />
            <Resources dataSource={resources} />
            <ResourceAssignments dataSource={resourceAssignments} />

            <Column dataField="title" caption="Subject" width={300} />
            <Column dataField="start" caption="Start Date" />
            <Column dataField="end" caption="End Date" />

            <Editing enabled={true} />
          </Gantt>
        </div>
      </div>
    );
  }
  onContextMenuPreparing(e) {
    e.cancel = this.state.disableContextMenu;
  }
  onCustomizeContextMenu(e) {
    this.setState({
      contextMenuItems: e.value ? this.getContextMenuItems() : undefined
    });
  }
  onPreventContextMenuShowing(e) {
    this.setState({
      disableContextMenu: e.value
    });
  }
  onCustomCommandClick(e) {
    if(e.name == 'ToggleDisplayOfResources') {
      this.setState({
        showResources: !this.state.showResources
      });
    }
  }
  getContextMenuItems() {
    return [
      'addTask',
      'taskdetails',
      'deleteTask',
      {
        name: 'ToggleDisplayOfResources',
        text: 'Toggle Display of Resources'
      }
    ];
  }
}

export default App;
