import React, { useCallback } from 'react';
import Scheduler, { Resource, View } from 'devextreme-react/scheduler';
import { data, priorityData } from './data.js';

const currentDate = new Date(2021, 3, 21);
const groups = ['priorityId'];
const App = () => {
  const onSelectionEnd = useCallback((e) => {
    const cells = e.selectedCellData;
    if (cells.length <= 1) {
      return;
    }
    const startDate = cells[0].startDateUTC || cells[0].startDate;
    const endDate = cells[cells.length - 1].endDateUTC || cells[cells.length - 1].endDate;
    e.component.showAppointmentPopup(
      {
        startDate,
        endDate,
        allDay: cells[0].allDay,
        ...cells[0].groups,
      },
      true,
    );
  }, []);
  return (
    <Scheduler
      timeZone="America/Los_Angeles"
      dataSource={data}
      groups={groups}
      defaultCurrentView="workWeek"
      defaultCurrentDate={currentDate}
      startDayHour={9}
      endDayHour={16}
      allDayPanelMode="allDay"
      onSelectionEnd={onSelectionEnd}
    >
      <View
        type="workWeek"
        groupOrientation="horizontal"
        cellDuration={30}
      />
      <Resource
        fieldExpr="priorityId"
        allowMultiple={false}
        dataSource={priorityData}
        label="Priority"
      />
    </Scheduler>
  );
};
export default App;
