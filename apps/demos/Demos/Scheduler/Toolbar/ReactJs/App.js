import React, {
  useCallback, useMemo, useRef, useState,
} from 'react';
import {
  Scheduler, Resource, Toolbar, Item,
} from 'devextreme-react/scheduler';
import { SelectBox } from 'devextreme-react/select-box';
import { assignees, schedulerDataSource, currentDate } from './data.js';

const views = ['day', 'week', 'workWeek', 'month'];
const selectBoxPlaceholder = 'Select Employee';
const inputAttr = { 'aria-label': selectBoxPlaceholder };
const MS_IN_HOUR = 60 * 1000;
const App = () => {
  const schedulerRef = useRef(null);
  const [assigneesFilterValue, setAssigneesFilterValue] = useState();
  const onAssigneesFilterChange = useCallback((event) => {
    const scheduler = schedulerRef.current?.instance?.();
    if (!scheduler) {
      return;
    }
    const dataSource = scheduler.option('dataSource');
    const filter = event.value ? ['assigneeId', 'contains', event.value] : null;
    dataSource.filter(filter);
    scheduler.option('dataSource', dataSource);
    setAssigneesFilterValue(event.value);
  }, []);
  const onAppointmentAdd = useCallback(() => {
    const scheduler = schedulerRef.current?.instance?.();
    if (!scheduler) {
      return;
    }
    const selected = scheduler.option('selectedCellData') ?? [];
    if (selected.length) {
      const firstSelected = selected[0];
      const lastSelected = selected.at(-1);
      scheduler.showAppointmentPopup(
        {
          ...firstSelected.groups,
          allDay: firstSelected.allDay,
          startDate: new Date(firstSelected.startDateUTC),
          endDate: new Date(lastSelected.endDateUTC),
        },
        true,
      );
      return;
    }
    const currentDate = scheduler.option('currentDate');
    const cellDuration = scheduler.option('cellDuration');
    const cellDurationMs = cellDuration * MS_IN_HOUR;
    const currentTime = new Date(currentDate).getTime();
    const roundTime = Math.round(currentTime / cellDurationMs) * cellDurationMs;
    scheduler.showAppointmentPopup(
      {
        startDate: new Date(roundTime),
        endDate: new Date(roundTime + cellDurationMs),
      },
      true,
    );
  }, []);
  const toggleButtonOptions = useMemo(
    () => ({
      icon: 'plus',
      text: 'New Appointment',
      stylingMode: 'outlined',
      type: 'normal',
      onClick() {
        onAppointmentAdd();
      },
    }),
    [onAppointmentAdd],
  );
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
        icon="user"
      />
      <Toolbar>
        <Item name="today" />
        <Item name="dateNavigator" />
        <Item
          location="before"
          locateInMenu="auto"
          widget="dxButton"
          options={toggleButtonOptions}
        />
        <Item
          location="before"
          locateInMenu="auto"
        >
          <SelectBox
            placeholder={selectBoxPlaceholder}
            items={assignees}
            showClearButton={true}
            displayExpr="text"
            valueExpr="id"
            inputAttr={inputAttr}
            width={200}
            value={assigneesFilterValue}
            onValueChanged={onAssigneesFilterChange}
          />
        </Item>
        <Item
          location="after"
          locateInMenu="auto"
          name="viewSwitcher"
        />
      </Toolbar>
    </Scheduler>
  );
};
export default App;
