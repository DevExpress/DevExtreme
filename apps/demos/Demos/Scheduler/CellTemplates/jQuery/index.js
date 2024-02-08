$(() => {
  $('#scheduler').dxScheduler({
    dataSource: data,
    views: ['workWeek', 'month'],
    currentView: 'workWeek',
    currentDate: new Date(2021, 3, 27),
    firstDayOfWeek: 0,
    startDayHour: 9,
    endDayHour: 19,
    showAllDayPanel: false,
    height: 730,

    dataCellTemplate(itemData, itemIndex, itemElement) {
      const date = itemData.startDate;
      const element = $('<div />');

      if (isDisableDate(date)) {
        element.addClass('disable-date');
      } else if (isDinner(date)) {
        element.addClass('dinner');
      }

      const isMonth = this.option('currentView') === 'month';
      if (isMonth) {
        element.text(date.getDate());
        element.addClass('dx-scheduler-date-table-cell-text');
      }

      return itemElement.append(element);
    },

    dateCellTemplate(itemData, itemIndex, itemElement) {
      const element = $(`<div>${itemData.text}</div>`);
      const isMonth = this.option('currentView') === 'month';
      const isDisabled = isMonth
        ? isWeekend(itemData.date)
        : isDisableDate(itemData.date);

      if (isDisabled) {
        element.addClass('disable-date');
      }

      return itemElement.append(element);
    },

    timeCellTemplate(itemData, itemIndex, itemElement) {
      const element = $(`<div>${itemData.text}</div>`);
      const { date } = itemData;

      if (isDinner(date)) {
        element.addClass('dinner');
      }
      if (hasCoffeeCupIcon(date)) {
        element.append('<div class="cafe" />');
      }

      return itemElement.append(element);
    },

    onAppointmentFormOpening(e) {
      const startDate = new Date(e.appointmentData.startDate);
      if (!isValidAppointmentDate(startDate)) {
        e.cancel = true;
        notifyDisableDate();
      }
      applyDisableDatesToDateEditors(e.form);
    },

    onAppointmentAdding(e) {
      if (!isValidAppointment(e.component, e.appointmentData)) {
        e.cancel = true;
        notifyDisableDate();
      }
    },

    onAppointmentUpdating(e) {
      if (!isValidAppointment(e.component, e.newData)) {
        e.cancel = true;
        notifyDisableDate();
      }
    },
  });
});

const dinnerTime = { from: 12, to: 13 };
const holidays = [
  new Date(2021, 3, 29),
  new Date(2021, 5, 6),
];

function notifyDisableDate() {
  DevExpress.ui.notify('Cannot create or move an appointment/event to disabled time/date regions.', 'warning', 1000);
}

function isValidAppointment(component, appointmentData) {
  const startDate = new Date(appointmentData.startDate);
  const endDate = new Date(appointmentData.endDate);
  const cellDuration = component.option('cellDuration');
  return isValidAppointmentInterval(startDate, endDate, cellDuration);
}

function isValidAppointmentInterval(startDate, endDate, cellDuration) {
  const edgeEndDate = new Date(endDate.getTime() - 1);

  if (!isValidAppointmentDate(edgeEndDate)) {
    return false;
  }

  const durationInMs = cellDuration * 60 * 1000;
  const date = startDate;
  while (date <= endDate) {
    if (!isValidAppointmentDate(date)) {
      return false;
    }
    const newDateTime = date.getTime() + durationInMs - 1;
    date.setTime(newDateTime);
  }

  return true;
}

function isValidAppointmentDate(date) {
  return !isHoliday(date) && !isDinner(date) && !isWeekend(date);
}

function isHoliday(date) {
  const localeDate = date.toLocaleDateString();
  return holidays.filter((holiday) => holiday.toLocaleDateString() === localeDate).length > 0;
}

function isWeekend(date) {
  const day = date.getDay();
  return day === 0 || day === 6;
}

function isDisableDate(date) {
  return isHoliday(date) || isWeekend(date);
}

function isDinner(date) {
  const hours = date.getHours();
  return hours >= dinnerTime.from && hours < dinnerTime.to;
}

function hasCoffeeCupIcon(date) {
  const hours = date.getHours();
  const minutes = date.getMinutes();

  return hours === dinnerTime.from && minutes === 0;
}

function applyDisableDatesToDateEditors(form) {
  const startDateEditor = form.getEditor('startDate');
  startDateEditor.option('disabledDates', holidays);

  const endDateEditor = form.getEditor('endDate');
  endDateEditor.option('disabledDates', holidays);
}
