window.onload = function () {
  function showToast(event, value, type) {
    DevExpress.ui.notify(`${event} "${value}" task`, type, 800);
  }

  const allowAddingValue = ko.observable(true);
  const allowDeletingValue = ko.observable(true);
  const allowUpdatingValue = ko.observable(true);
  const allowResizingValue = ko.observable(true);
  const allowDraggingValue = ko.observable(true);
  const disabledValue = ko.observable(false);

  const viewModel = {
    schedulerOptions: {
      timeZone: 'America/Los_Angeles',
      dataSource: data,
      views: ['day', 'week'],
      currentView: 'week',
      currentDate: new Date(2021, 3, 29),
      startDayHour: 9,
      endDayHour: 19,
      editing: {
        allowAdding: allowAddingValue,
        allowDeleting: allowDeletingValue,
        allowUpdating: allowUpdatingValue,
        allowResizing: allowResizingValue,
        allowDragging: allowDraggingValue,
      },
      onAppointmentAdded(e) {
        showToast('Added', e.appointmentData.text, 'success');
      },
      onAppointmentUpdated(e) {
        showToast('Updated', e.appointmentData.text, 'info');
      },
      onAppointmentDeleted(e) {
        showToast('Deleted', e.appointmentData.text, 'warning');
      },
      height: 600,
    },
    allowAddingOptions: {
      text: 'Allow adding',
      value: allowAddingValue,
    },
    allowDeletingOptions: {
      text: 'Allow deleting',
      value: allowDeletingValue,
    },
    allowUpdatingOptions: {
      text: 'Allow updating',
      onValueChanged(data) {
        disabledValue(!data.value);
      },
      value: allowUpdatingValue,
    },
    allowResizingOptions: {
      text: 'Allow resizing',
      disabled: disabledValue,
      value: allowResizingValue,
    },
    allowDraggingOptions: {
      text: 'Allow dragging',
      disabled: disabledValue,
      value: allowDraggingValue,
    },
  };

  ko.applyBindings(viewModel, document.getElementById('scheduler-demo'));
};
