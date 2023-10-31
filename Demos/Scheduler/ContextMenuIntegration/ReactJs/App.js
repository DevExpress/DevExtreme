import React from 'react';
import Scheduler, { Resource } from 'devextreme-react/scheduler';
import ContextMenu from 'devextreme-react/context-menu';
import { data, resourcesData } from './data.js';
import AppointmentMenuTemplate from './AppointmentTemplate.js';

const views = ['day', 'month'];
const appointmentClassName = '.dx-scheduler-appointment';
const cellClassName = '.dx-scheduler-date-table-cell';
const onContextMenuItemClick = (e) => {
  e.itemData.onItemClick?.(e);
};
const App = () => {
  const schedulerRef = React.useRef(null);
  const [currentDate, setCurrentDate] = React.useState(new Date(2020, 10, 25));
  const [contextMenuItems, setContextMenuItems] = React.useState([]);
  const [target, setTarget] = React.useState(appointmentClassName);
  const [disabled, setDisabled] = React.useState(true);
  const [groups, setGroups] = React.useState(undefined);
  const [crossScrollingEnabled, setCrossScrollingEnabled] = React.useState(false);
  const onAppointmentContextMenu = React.useCallback((event) => {
    const { appointmentData, targetedAppointmentData } = event;
    const scheduler = schedulerRef.current?.instance;
    const resourceItems = resourcesData.map((item) => ({
      ...item,
      onItemClick: (e) =>
        scheduler?.updateAppointment(appointmentData, {
          ...appointmentData,
          ...{ roomId: [e.itemData.id] },
        }),
    }));
    setTarget(appointmentClassName);
    setDisabled(false);
    setContextMenuItems([
      {
        text: 'Open',
        onItemClick: () => scheduler?.showAppointmentPopup(appointmentData),
      },
      {
        text: 'Delete',
        onItemClick: () => scheduler?.deleteAppointment(appointmentData),
      },
      {
        text: 'Repeat Weekly',
        beginGroup: true,
        onItemClick: () =>
          scheduler?.updateAppointment(appointmentData, {
            startDate: targetedAppointmentData?.startDate,
            recurrenceRule: 'FREQ=WEEKLY',
          }),
      },
      {
        text: 'Set Room',
        beginGroup: true,
        disabled: true,
      },
      ...resourceItems,
    ]);
  }, []);
  const onCellContextMenu = React.useCallback(
    (e) => {
      const scheduler = schedulerRef.current?.instance;
      setTarget(cellClassName);
      setDisabled(false);
      setContextMenuItems([
        {
          text: 'New Appointment',
          onItemClick: () =>
            scheduler?.showAppointmentPopup({ startDate: e.cellData.startDate }, true),
        },
        {
          text: 'New Recurring Appointment',
          onItemClick: () =>
            scheduler?.showAppointmentPopup(
              {
                startDate: e.cellData.startDate,
                recurrenceRule: 'FREQ=DAILY',
              },
              true,
            ),
        },
        {
          text: 'Group by Room/Ungroup',
          beginGroup: true,
          onItemClick: () => {
            if (groups) {
              setCrossScrollingEnabled(false);
              setGroups(undefined);
            } else {
              setCrossScrollingEnabled(true);
              setGroups(['roomId']);
            }
          },
        },
        {
          text: 'Go to Today',
          onItemClick: () => {
            setCurrentDate(new Date());
          },
        },
      ]);
    },
    [groups],
  );
  return (
    <React.Fragment>
      <Scheduler
        ref={schedulerRef}
        timeZone="America/Los_Angeles"
        dataSource={data}
        views={views}
        groups={groups}
        crossScrollingEnabled={crossScrollingEnabled}
        defaultCurrentView="month"
        currentDate={currentDate}
        startDayHour={9}
        recurrenceEditMode="series"
        onAppointmentContextMenu={onAppointmentContextMenu}
        onCellContextMenu={onCellContextMenu}
        height={730}
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
        onItemClick={onContextMenuItemClick}
        itemComponent={AppointmentMenuTemplate}
      />
    </React.Fragment>
  );
};
export default App;
