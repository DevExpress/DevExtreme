import React from 'react';
import Scheduler, { Resource } from 'devextreme-react/scheduler';
import ContextMenu from 'devextreme-react/context-menu';

import { data, resourcesData } from './data.js';
import { cellContextMenuItems, appointmentContextMenuItems, setResource } from './MenuItems.js';

import { AppointmentMenuTemplate } from './AppointmentTemplate.js';

const currentDate = new Date(2021, 2, 25);
const views = ['day', 'month'];

class App extends React.Component {
  constructor(props) {
    super(props);
    resourcesData.map(function(item) {
      item.onItemClick = setResource;
    });
    this.appointmentContextMenuItems = appointmentContextMenuItems.concat(resourcesData);

    this.state = {
      contextMenuItems: [],
      target: null,
      disabled: true,
      contextMenuEvent: null
    };

    this.onAppointmentContextMenu = this.onAppointmentContextMenu.bind(this);
    this.onContextMenuItemClick = this.onContextMenuItemClick.bind(this);
    this.onCellContextMenu = this.onCellContextMenu.bind(this);
    this.onContextMenuHiding = this.onContextMenuHiding.bind(this);
  }

  render() {
    const { contextMenuItems, target, disabled } = this.state;
    return (
      <React.Fragment>
        <Scheduler
          dataSource={data}
          views={views}
          defaultCurrentView="month"
          defaultCurrentDate={currentDate}
          firstDayOfWeek={1}
          startDayHour={9}
          recurrenceEditMode="series"
          onAppointmentContextMenu={this.onAppointmentContextMenu}
          onCellContextMenu={this.onCellContextMenu}
          height={600}
        >
          <Resource
            dataSource={resourcesData}
            fieldExpr="roomId"
            label="Room"
          />
        </Scheduler>
        <ContextMenu
          dataSource={contextMenuItems}
          width={200}
          target={target}
          disabled={disabled}
          onItemClick={this.onContextMenuItemClick}
          itemRender={AppointmentMenuTemplate}
          onHiding={this.onContextMenuHiding}
        />
      </React.Fragment>
    );
  }

  onAppointmentContextMenu(e) {
    this.setState({
      target: '.dx-scheduler-appointment',
      disabled: false,
      contextMenuItems: this.appointmentContextMenuItems,
      contextMenuEvent: e
    });
  }

  onContextMenuItemClick(e) {
    const { contextMenuEvent } = this.state;
    e.itemData.onItemClick(contextMenuEvent, e);
  }

  onCellContextMenu(e) {
    this.setState({
      target: '.dx-scheduler-date-table-cell',
      disabled: false,
      contextMenuItems: cellContextMenuItems,
      contextMenuEvent: e
    });
  }

  onContextMenuHiding() {
    this.setState({
      disabled: true,
      contextMenuItems: []
    });
  }
}

export default App;
