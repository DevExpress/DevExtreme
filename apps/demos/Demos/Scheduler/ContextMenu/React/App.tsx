import React, { useCallback, useState } from 'react';

import { Scheduler, Resource } from 'devextreme-react/scheduler';
import type { SchedulerTypes } from 'devextreme-react/scheduler';
import { ContextMenu } from 'devextreme-react/context-menu';
import type { ContextMenuTypes } from 'devextreme-react/context-menu';

import ItemTemplate from './itemTemplate.tsx';
import { data, resourcesData } from './data.ts';
import type { ContextMenuItem } from './types';

const views: SchedulerTypes.ViewType[] = ['day', 'month'];

const onContextMenuItemClick = (e: ContextMenuTypes.ItemClickEvent<ContextMenuItem>) => {
  e.itemData?.onItemClick?.(e);
};

const App = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2020, 10, 25));
  const [appointmentContextMenuItems, setAppointmentContextMenuItems] = useState<ContextMenuItem[]>([]);
  const [cellContextMenuItems, setCellContextMenuItems] = useState<ContextMenuItem[]>([]);
  const [groups, setGroups] = useState<string[]>([]);
  const [crossScrollingEnabled, setCrossScrollingEnabled] = useState(false);

  const getAppointmentContextMenuItems = useCallback((e: SchedulerTypes.AppointmentContextMenuEvent) => {
    const { appointmentData: appointment, targetedAppointmentData: targetedAppointment } = e;
    const scheduler = e.component;

    return [
      {
        text: 'Open',
        onItemClick: () => scheduler?.showAppointmentPopup(appointment),
      },
      {
        text: 'Delete',
        onItemClick: () => scheduler?.deleteAppointment(appointment),
      },
      {
        text: 'Repeat Weekly',
        beginGroup: true,
        onItemClick: () => scheduler?.updateAppointment(appointment, {
          ...appointment,
          startDate: targetedAppointment?.startDate,
          recurrenceRule: 'FREQ=WEEKLY',
        }),
      },
      {
        text: 'Set Room',
        beginGroup: true,
        disabled: true,
      },
      ...resourcesData.map((item) => ({
        ...item,
        onItemClick: (clickEvent: ContextMenuTypes.ItemClickEvent<ContextMenuItem>) => {
          scheduler?.updateAppointment(appointment, {
            ...appointment,
            roomId: [clickEvent.itemData?.id],
          });
        },
      })),
    ];
  }, []);

  const getCellContextMenuItems = useCallback((e: SchedulerTypes.CellContextMenuEvent) => {
    const scheduler = e.component;

    return [
      {
        text: 'New Appointment',
        onItemClick: () => {
          scheduler?.showAppointmentPopup(
            { startDate: e.cellData.startDateUTC },
            true,
          );
        },
      },
      {
        text: 'New Recurring Appointment',
        onItemClick: () => {
          scheduler?.showAppointmentPopup(
            {
              startDate: e.cellData.startDateUTC,
              recurrenceRule: 'FREQ=DAILY',
            },
            true,
          );
        },
      },
      {
        text: 'Group by Room/Ungroup',
        beginGroup: true,
        onItemClick: () => {
          if (groups.length) {
            setCrossScrollingEnabled(false);
            setGroups([]);
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
    ];
  }, [groups]);

  const onAppointmentContextMenu = useCallback((e: SchedulerTypes.AppointmentContextMenuEvent) => {
    const items = getAppointmentContextMenuItems(e);
    setAppointmentContextMenuItems(items);
  }, [getAppointmentContextMenuItems]);

  const onCellContextMenu = useCallback((e: SchedulerTypes.CellContextMenuEvent) => {
    const items = getCellContextMenuItems(e);
    setCellContextMenuItems(items);
  }, [getCellContextMenuItems]);

  return (
    <>
      <ContextMenu
        dataSource={appointmentContextMenuItems}
        width={200}
        target=".dx-scheduler-appointment"
        onItemClick={onContextMenuItemClick}
        itemComponent={ItemTemplate}
      />
      <ContextMenu
        dataSource={cellContextMenuItems}
        width={200}
        target=".dx-scheduler-date-table-cell"
        onItemClick={onContextMenuItemClick}
        itemComponent={ItemTemplate}
      />
      <Scheduler
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
    </>
  );
};

export default App;
