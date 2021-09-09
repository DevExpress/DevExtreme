import React from 'react';
import Scheduler, { Resource } from 'devextreme-react/scheduler';
import ContextMenu from 'devextreme-react/context-menu';

import { data, resourcesData } from './data.js';

import { AppointmentMenuTemplate } from './AppointmentTemplate.js';

const views = ['day', 'month'];

const appointmentClassName = '.dx-scheduler-appointment';
const cellClassName = '.dx-scheduler-date-table-cell';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.scheduler = React.createRef();
    this.state = {
      currentDate: new Date(2020, 10, 25),
      contextMenuItems: [],
      target: appointmentClassName,
      disabled: true,
    };
    this.onAppointmentContextMenu = this.onAppointmentContextMenu.bind(this);
    this.onContextMenuItemClick = this.onContextMenuItemClick.bind(this);
    this.onCellContextMenu = this.onCellContextMenu.bind(this);
  }

  render() {
    const {
      contextMenuItems, target, disabled, currentDate, groups, crossScrollingEnabled,
    } = this.state;
    return (
      <React.Fragment>
        <Scheduler
          ref={this.scheduler}
          timeZone="America/Los_Angeles"
          dataSource={data}
          views={views}
          groups={groups}
          crossScrollingEnabled={crossScrollingEnabled}
          defaultCurrentView="month"
          currentDate={currentDate}
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
        />
      </React.Fragment>
    );
  }

  onAppointmentContextMenu({ appointmentData, targetedAppointmentData }) {
    const scheduler = this.scheduler.current.instance;
    const resourceItems = resourcesData.map((item) => ({
      ...item,
      onItemClick: ({ itemData }) => scheduler.updateAppointment(appointmentData, {
        ...appointmentData,
        ...{ roomId: [itemData.id] },
      }),
    }));
    this.setState((state) => ({
      ...state,
      target: appointmentClassName,
      disabled: false,
      contextMenuItems: [
        {
          text: 'Open',
          onItemClick: () => scheduler.showAppointmentPopup(appointmentData),
        },
        {
          text: 'Delete',
          onItemClick: () => scheduler.deleteAppointment(appointmentData),
        },
        {
          text: 'Repeat Weekly',
          beginGroup: true,
          onItemClick: () => scheduler.updateAppointment(appointmentData, {
            startDate: targetedAppointmentData.startDate,
            recurrenceRule: 'FREQ=WEEKLY',
          }),
        },
        { text: 'Set Room', beginGroup: true, disabled: true },
        ...resourceItems,
      ],
    }));
  }

  onContextMenuItemClick(e) {
    e.itemData.onItemClick(e);
  }

  onCellContextMenu({ cellData }) {
    const scheduler = this.scheduler.current.instance;
    this.setState((state) => ({
      ...state,
      target: cellClassName,
      disabled: false,
      contextMenuItems: [
        {
          text: 'New Appointment',
          onItemClick: () => scheduler.showAppointmentPopup(
            { startDate: cellData.startDate },
            true,
          ),
        },
        {
          text: 'New Recurring Appointment',
          onItemClick: () => scheduler.showAppointmentPopup(
            {
              startDate: cellData.startDate,
              recurrenceRule: 'FREQ=DAILY',
            },
            true,
          ),
        },
        {
          text: 'Group by Room/Ungroup',
          beginGroup: true,
          onItemClick: () => {
            if (this.groups) {
              this.setState((currentState) => ({
                ...currentState,
                crossScrollingEnabled: false,
                groups: null,
              }));
            } else {
              this.setState((currentState) => ({
                ...currentState,
                crossScrollingEnabled: true,
                groups: ['roomId'],
              }));
            }
          },
        },
        {
          text: 'Go to Today',
          onItemClick: () => {
            this.setState((currentState) => ({
              ...currentState,
              currentDate: new Date(),
            }));
          },
        },
      ],
    }));
  }
}

export default App;
