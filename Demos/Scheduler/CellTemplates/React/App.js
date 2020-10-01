import React from 'react';

import Scheduler from 'devextreme-react/scheduler';
import notify from 'devextreme/ui/notify';

import { data, holidays } from './data.js';
import Utils from './utils.js';
import DataCell from './DataCell.js';
import DateCell from './DateCell.js';
import TimeCell from './TimeCell.js';

const currentDate = new Date(2021, 4, 25);
const views = ['workWeek', 'month'];
const currentView = views[0];

class App extends React.Component {
  constructor(props) {
    super(props);

    this.onAppointmentFormOpening = this.onAppointmentFormOpening.bind(this);
    this.onAppointmentAdding = this.onAppointmentAdding.bind(this);
    this.onAppointmentUpdating = this.onAppointmentUpdating.bind(this);
  }

  onAppointmentFormOpening(e) {
    const startDate = new Date(e.appointmentData.startDate);
    if(!Utils.isValidAppointmentDate(startDate)) {
      e.cancel = true;
      this.notifyDisableDate();
    }
    this.applyDisableDatesToDateEditors(e.form);
  }

  onAppointmentAdding(e) {
    const isValidAppointment = Utils.isValidAppointment(e.component, e.appointmentData);
    if(!isValidAppointment) {
      e.cancel = true;
      this.notifyDisableDate();
    }
  }

  onAppointmentUpdating(e) {
    const isValidAppointment = Utils.isValidAppointment(e.component, e.newData);
    if(!isValidAppointment) {
      e.cancel = true;
      this.notifyDisableDate();
    }
  }

  notifyDisableDate() {
    notify('Cannot create or move an appointment/event to disabled time/date regions.', 'warning', 1000);
  }

  applyDisableDatesToDateEditors(form) {
    const startDateEditor = form.getEditor('startDate');
    startDateEditor.option('disabledDates', holidays);

    const endDateEditor = form.getEditor('endDate');
    endDateEditor.option('disabledDates', holidays);
  }

  renderDataCell(itemData) {
    return <DataCell itemData={itemData} />;
  }

  renderDateCell(itemData) {
    return <DateCell itemData={itemData} />;
  }

  renderTimeCell(itemData) {
    return <TimeCell itemData={itemData} />;
  }

  render() {
    return (
      <Scheduler
        dataSource={data}
        views={views}
        defaultCurrentView={currentView}
        defaultCurrentDate={currentDate}
        height={600}
        showAllDayPanel={false}
        firstDayOfWeek={0}
        startDayHour={9}
        endDayHour={19}
        dataCellRender={this.renderDataCell}
        dateCellRender={this.renderDateCell}
        timeCellRender={this.renderTimeCell}
        onAppointmentFormOpening={this.onAppointmentFormOpening}
        onAppointmentAdding={this.onAppointmentAdding}
        onAppointmentUpdating={this.onAppointmentUpdating}
      />
    );
  }
}

export default App;
