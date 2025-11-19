import React, { useCallback, useRef, useState } from 'react';

import { Scheduler, Resource, type SchedulerTypes, SchedulerRef } from 'devextreme-react/scheduler';
import { ContextMenu, type ContextMenuTypes } from 'devextreme-react/context-menu';

import AppointmentMenuTemplate from './AppointmentTemplate.tsx';
import { data, resourcesData } from './data.ts';
import type { ContextMenuItem } from './types';

const views: SchedulerTypes.ViewType[] = ['day', 'month'];

const appointmentClassName = '.dx-scheduler-appointment';
const cellClassName = '.dx-scheduler-date-table-cell';

const onContextMenuItemClick = (e: ContextMenuTypes.ItemClickEvent<ContextMenuItem>) => {
  e.itemData.onItemClick?.(e);
};

const App = () => {
  const schedulerRef = useRef<SchedulerRef>(null);
  const [currentDate, setCurrentDate] = useState(new Date(2020, 10, 25));
  const [contextMenuItems, setContextMenuItems] = useState<ContextMenuItem[]>([]);
  const [target, setTarget] = useState(appointmentClassName);
  const [disabled, setDisabled] = useState(true);
  const [groups, setGroups] = useState<string[] | undefined>(undefined);
  const [crossScrollingEnabled, setCrossScrollingEnabled] = useState(false);

  const onAppointmentContextMenu = useCallback((event: SchedulerTypes.AppointmentContextMenuEvent) => {
    const { appointmentData, targetedAppointmentData } = event;
    const scheduler = schedulerRef.current?.instance();

    const resourceItems: ContextMenuItem[] = resourcesData.map((item) => ({
      ...item,
      onItemClick: (e: ContextMenuTypes.ItemClickEvent<ContextMenuItem>) => scheduler?.updateAppointment(appointmentData, {
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

  const onCellContextMenu = useCallback((e: SchedulerTypes.CellContextMenuEvent) => {
    const scheduler = schedulerRef.current?.instance();

    setTarget(cellClassName);
    setDisabled(false);
    setContextMenuItems([
      {
        text: 'New Appointment',
        onItemClick: () => scheduler?.showAppointmentPopup(
          { startDate: e.cellData.startDateUTC },
          true,
        ),
      },
      {
        text: 'New Recurring Appointment',
        onItemClick: () => scheduler?.showAppointmentPopup(
          {
            startDate: e.cellData.startDateUTC,
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
          icon="conferenceroomoutline"
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
