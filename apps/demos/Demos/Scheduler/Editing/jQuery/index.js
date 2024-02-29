$(() => {
  function showToast(event, value, type) {
    DevExpress.ui.notify(`${event} "${value}" task`, type, 800);
  }

  const scheduler = $('#scheduler').dxScheduler({
    timeZone: 'America/Los_Angeles',
    dataSource: data,
    views: ['day', 'week'],
    currentView: 'week',
    currentDate: new Date(2021, 3, 29),
    startDayHour: 9,
    endDayHour: 19,
    editing: {
      allowAdding: true,
      allowDeleting: true,
      allowUpdating: true,
      allowResizing: true,
      allowDragging: true,
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
  }).dxScheduler('instance');

  $('#allow-adding').dxCheckBox({
    text: 'Allow adding',
    value: true,
    onValueChanged(e) {
      scheduler.option('editing.allowAdding', e.value);
    },
  });

  $('#allow-deleting').dxCheckBox({
    text: 'Allow deleting',
    value: true,
    onValueChanged(e) {
      scheduler.option('editing.allowDeleting', e.value);
    },
  });

  $('#allow-updating').dxCheckBox({
    text: 'Allow updating',
    value: true,
    onValueChanged(e) {
      scheduler.option('editing.allowUpdating', e.value);
      dragging.option('disabled', !e.value);
      resizing.option('disabled', !e.value);
    },
  });

  const resizing = $('#allow-resizing').dxCheckBox({
    text: 'Allow resizing',
    value: true,
    onValueChanged(e) {
      scheduler.option('editing.allowResizing', e.value);
    },
  }).dxCheckBox('instance');

  const dragging = $('#allow-dragging').dxCheckBox({
    text: 'Allow dragging',
    value: true,
    onValueChanged(e) {
      scheduler.option('editing.allowDragging', e.value);
    },
  }).dxCheckBox('instance');
});
