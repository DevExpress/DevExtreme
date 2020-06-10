function createAppointment(e) {
  e.component.showAppointmentPopup({
    startDate: e.cellData.startDate
  }, true);
}

function createRecurringAppointment(e) {
  e.component.showAppointmentPopup({
    startDate: e.cellData.startDate,
    recurrenceRule: 'FREQ=DAILY'
  }, true);
}

function groupCell(e) {
  const scheduler = e.component;

  if (scheduler.option('groups')) {
    scheduler.option({ crossScrollingEnabled: false, groups: undefined });
  } else {
    scheduler.option({ crossScrollingEnabled: true, groups: ['roomId'] });
  }
}

function showCurrentDate(e) {
  e.component.option('currentDate', new Date());
}

function showAppointment(e) {
  e.component.showAppointmentPopup(e.appointmentData);
}

function deleteAppointment(e) {
  e.component.deleteAppointment(e.appointmentData);
}

function repeatAppointmentWeekly(e) {
  e.component.updateAppointment(e.appointmentData, {
    startDate: e.targetedAppointmentData.startDate,
    recurrenceRule: 'FREQ=WEEKLY'
  });
}

export function setResource(e, clickEvent) {
  const itemData = e.appointmentData;

  e.component.updateAppointment(itemData, {
    itemData,
    ...{ roomId: [clickEvent.itemData.id] }
  });
}

export const cellContextMenuItems = [
  { text: 'New Appointment', onItemClick: createAppointment },
  { text: 'New Recurring Appointment', onItemClick: createRecurringAppointment },
  { text: 'Group by Room/Ungroup', beginGroup: true, onItemClick: groupCell },
  { text: 'Go to Today', onItemClick: showCurrentDate }
];

export const appointmentContextMenuItems = [
  { text: 'Open', onItemClick: showAppointment },
  { text: 'Delete', onItemClick: deleteAppointment },
  { text: 'Repeat Weekly', beginGroup: true, onItemClick: repeatAppointmentWeekly },
  { text: 'Set Room', beginGroup: true, disabled: true }
];
