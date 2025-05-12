import React, { useCallback, useMemo, useRef, useState } from 'react';

import Scheduler, { Toolbar, Item, Resource, type SchedulerTypes, type SchedulerRef } from 'devextreme-react/scheduler';
import SelectBox, { type SelectBoxTypes } from 'devextreme-react/select-box';

import { assignees, schedulerDataSource, currentDate } from './data.ts';

const views: SchedulerTypes.ViewType[] = ['day', 'week', 'workWeek', 'month'];
const selectBoxPlaceholder = 'Select Employee';
const inputAttr = { 'aria-label': selectBoxPlaceholder };

const App = () => {
  const schedulerRef = useRef<SchedulerRef>(null);
  const [assigneesFilterValue, setAssigneesFilterValue] = useState<number>();

  const onAssigneesFilterChange = useCallback((event: SelectBoxTypes.ValueChangedEvent) => {
    const scheduler = schedulerRef.current!.instance()!;
    const filter = event.value ? ['assigneeId', 'contains', event.value] : null;

    schedulerDataSource.filter(filter);
    scheduler.option('dataSource', schedulerDataSource);
    setAssigneesFilterValue(event.value);
  }, []);
  const toggleButtonOptions = useMemo(() => ({
    icon: 'plus',
    text: 'New Appointment',
    stylingMode: 'outlined',
    type: 'normal',
    onClick() {
      const scheduler = schedulerRef.current!.instance()!;
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
        <Item location="before" locateInMenu="auto">
          <SelectBox
            placeholder={selectBoxPlaceholder}
            items={assignees}
            showClearButton={true}
            displayExpr="text"
            valueExpr="id"
            inputAttr={inputAttr}
            width={200}
            value={assigneesFilterValue}
            onValueChanged={onAssigneesFilterChange} />
        </Item>
        <Item location="after" locateInMenu="auto" name="viewSwitcher" />
      </Toolbar>
    </Scheduler>
  );
};

export default App;
