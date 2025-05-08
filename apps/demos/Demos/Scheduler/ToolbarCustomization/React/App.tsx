import React, { useCallback, useMemo, useRef, useState } from 'react';

import Scheduler, { Toolbar, Item, Resource, SchedulerTypes, SchedulerRef } from 'devextreme-react/scheduler';

import { data, assignees, schedulerDataSource, currentDate } from './data.ts';
import TagBox, { TagBoxTypes } from "devextreme-react/cjs/tag-box";

const views: SchedulerTypes.ViewType[] = ['day', 'week', 'workWeek', 'month'];
const inputAttr = { 'aria-label': 'Assignees' };
const elementAttr = { class: 'assignees-tag-box' };

const App = () => {
  const schedulerRef = useRef<SchedulerRef>(null);
  const [assigneesFilterValue, setAssigneesFilterValue] = useState<number>();

  const onAssigneesFilterChange = useCallback((event: TagBoxTypes.ValueChangedEvent) => {
    const filter = event.value ? ['assigneeId', 'contains', event.value] : null;

    schedulerDataSource.filter(filter);
    setAssigneesFilterValue(event.value);
  }, []);
  const toggleButtonOptions = useMemo(() => ({
    icon: 'plus',
    text: 'New Appointment',
    stylingMode: 'outlined',
    type: 'normal',
    onClick() {
      const scheduler = schedulerRef.current?.instance();
      if (!scheduler) {
        return;
      }

      const selected = scheduler.option('selectedCellData') ?? [];

      if (selected.length) {
        scheduler.showAppointmentPopup({
          ...selected[0].groups,
          allDay: selected[0].allDay,
          startDate: new Date(selected[0].startDateUTC),
          endDate: new Date(selected.at(-1).endDateUTC),
        }, true);
      } else {
        const currentDate = scheduler.option('currentDate');
        const cellDuration = scheduler.option('cellDuration') as number;
        const cellDurationMs = cellDuration * 60 * 1000; // ms
        const currentTime = new Date(currentDate as Date).getTime();
        const roundTime = Math.round(currentTime / cellDurationMs) * cellDurationMs;

        scheduler.showAppointmentPopup({
          startDate: new Date(roundTime),
          endDate: new Date(roundTime + cellDurationMs),
        }, true);
      }
    },
  }), []);

  return (
    <Scheduler
      timeZone="America/Los_Angeles"
      dataSource={schedulerDataSource}
      views={views}
      defaultCurrentView="workWeek"
      defaultCurrentDate={currentDate}
      startDayHour={9}
      endDayHour={19}
      height={600}
      ref={schedulerRef}
    >
      <Resource
        dataSource={assignees}
        allowMultiple={true}
        fieldExpr="assigneeId"
        label="Assignee"
      />
      <Toolbar>
        <Item name="today" />
        <Item name="dateNavigator" />
        <Item
          location="before"
          locateInMenu="auto"
          widget="dxButton"
          options={toggleButtonOptions} />
        <Item location="center" locateInMenu="auto">
          <TagBox
            items={assignees}
            displayExpr="text"
            valueExpr="id"
            showSelectionControls={true}
            maxDisplayedTags={1}
            inputAttr={inputAttr}
            elementAttr={elementAttr}
            value={assigneesFilterValue}
            onValueChanged={onAssigneesFilterChange} />
        </Item>
        <Item location="after" locateInMenu="auto" name="columnChooserButton" />
      </Toolbar>
    </Scheduler>
  );
};

export default App;
