import React from 'react';
import Scheduler, { Resource, SchedulerTypes } from 'devextreme-react/scheduler';
import ContextMenu, { ContextMenuTypes } from 'devextreme-react/context-menu';
import { data, resourcesData, Resource as ResourceItem } from './data.ts';
import AppointmentMenuTemplate from './AppointmentTemplate.tsx';

// eslint-disable-next-line no-unused-vars
type ContextMenuItem = ContextMenuTypes.Item & ResourceItem & { onItemClick?: (e: ContextMenuTypes.ItemClickEvent) => void };

const views: SchedulerTypes.ViewType[] = ['day', 'month'];

const appointmentClassName = '.dx-scheduler-appointment';
const cellClassName = '.dx-scheduler-date-table-cell';

const onContextMenuItemClick = (e: ContextMenuTypes.ItemClickEvent) => {
  (e.itemData as ContextMenuItem).onItemClick?.(e);
};

const App = () => {
  const schedulerRef = React.useRef<Scheduler>(null);
  const [currentDate, setCurrentDate] = React.useState(new Date(2020, 10, 25));
  const [contextMenuItems, setContextMenuItems] = React.useState<ContextMenuItem[]>([]);
  const [target, setTarget] = React.useState(appointmentClassName);
  const [disabled, setDisabled] = React.useState(true);
  const [groups, setGroups] = React.useState<string[] | undefined>(undefined);
  const [crossScrollingEnabled, setCrossScrollingEnabled] = React.useState(false);

  const onAppointmentContextMenu = React.useCallback((event: SchedulerTypes.AppointmentContextMenuEvent) => {
    const { appointmentData, targetedAppointmentData } = event;
    const scheduler = schedulerRef.current?.instance;

    const resourceItems: ContextMenuItem[] = resourcesData.map((item) => ({
      ...item,
      onItemClick: (e) => scheduler?.updateAppointment(appointmentData, {
        ...appointmentData,
        ...{ roomId: [(e.itemData as ContextMenuItem).id] },
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
        onItemClick: () => scheduler?.updateAppointment(appointmentData, {
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
  }
  , []);

  const onCellContextMenu = React.useCallback((e: SchedulerTypes.CellContextMenuEvent) => {
    const scheduler = schedulerRef.current?.instance;

    setTarget(cellClassName);
    setDisabled(false);
    setContextMenuItems([
      {
        text: 'New Appointment',
        onItemClick: () => scheduler?.showAppointmentPopup(
          { startDate: e.cellData.startDate },
          true,
        ),
      },
      {
        text: 'New Recurring Appointment',
        onItemClick: () => scheduler?.showAppointmentPopup(
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
  }, [groups]);

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
