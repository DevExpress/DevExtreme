/* eslint-disable func-style */
import React, { useCallback, useMemo, useState } from 'react';

import Scheduler, { SchedulerTypes } from 'devextreme-react/scheduler';
import notify from 'devextreme/ui/notify';
import Form from 'devextreme-react/form';
import { data, holidays } from './data.ts';
import Utils from './utils.ts';
import DataCell from './DataCell.tsx';
import DataCellMonth from './DataCellMonth.tsx';
import DateCell from './DateCell.tsx';
import TimeCell from './TimeCell.tsx';

const currentDate = new Date(2021, 3, 27);
const views: SchedulerTypes.ViewType[] = ['workWeek', 'month'];

const notifyDisableDate = () => {
  notify('Cannot create or move an appointment/event to disabled time/date regions.', 'warning', 1000);
};

const applyDisableDatesToDateEditors = (form: Form['instance']) => {
  const startDateEditor = form.getEditor('startDate');
  startDateEditor?.option('disabledDates', holidays);

  const endDateEditor = form.getEditor('endDate');
  endDateEditor?.option('disabledDates', holidays);
};

const onAppointmentFormOpening = (e: SchedulerTypes.AppointmentFormOpeningEvent) => {
  if (e.appointmentData?.startDate) {
    const startDate = new Date(e.appointmentData.startDate);
    if (!Utils.isValidAppointmentDate(startDate)) {
      e.cancel = true;
      notifyDisableDate();
    }
    applyDisableDatesToDateEditors(e.form);
  }
};

const onAppointmentAdding = (e: SchedulerTypes.AppointmentAddingEvent) => {
  const isValidAppointment = Utils.isValidAppointment(e.component, e.appointmentData);
  if (!isValidAppointment) {
    e.cancel = true;
    notifyDisableDate();
  }
};

const onAppointmentUpdating = (e: SchedulerTypes.AppointmentUpdatingEvent) => {
  const isValidAppointment = Utils.isValidAppointment(e.component, e.newData);
  if (!isValidAppointment) {
    e.cancel = true;
    notifyDisableDate();
  }
};

const App = () => {
  const [currentView, setCurrentView] = useState<SchedulerTypes.ViewType>(views[0]);

  const DataCellComponent = useMemo(() => (
    currentView === 'month' ? DataCellMonth : DataCell
  ), [currentView]);

  const onCurrentViewChange = useCallback((value) => setCurrentView(value), [setCurrentView]);

  const renderDateCell = useCallback((itemData) => (
    <DateCell itemData={itemData} currentView={currentView} />
  ), []);

  return (
    <Scheduler
      dataSource={data}
      views={views}
      defaultCurrentDate={currentDate}
      currentView={currentView}
      onCurrentViewChange={onCurrentViewChange}
      height={730}
      showAllDayPanel={false}
      firstDayOfWeek={0}
      startDayHour={9}
      endDayHour={19}
      dataCellComponent={DataCellComponent}
      dateCellRender={renderDateCell}
      timeCellComponent={TimeCell}
      onAppointmentFormOpening={onAppointmentFormOpening}
      onAppointmentAdding={onAppointmentAdding}
      onAppointmentUpdating={onAppointmentUpdating}
    />
  );
};

export default App;
