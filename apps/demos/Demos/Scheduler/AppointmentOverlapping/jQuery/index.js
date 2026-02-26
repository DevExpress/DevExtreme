$(() => {
  let allowOverlapping = false;

  function isOverlapping(a, b) {
    return a.startDate < b.endDate && a.endDate > b.startDate;
  }

  function detectConflict(newAppt) {
    const allItems = scheduler.getDataSource().items();

    const existingOccurrences = scheduler
      .getOccurrences(new Date(newAppt.startDate), new Date(newAppt.endDate), allItems)
      .filter((occ) => occ.appointmentData.id !== newAppt.id);

    const expandEnd = new Date(newAppt.endDate);
    expandEnd.setDate(expandEnd.getDate() + 14);

    const newOccurrences = scheduler.getOccurrences(
      new Date(newAppt.startDate),
      expandEnd,
      [newAppt],
    );

    return newOccurrences.some((newOcc) =>
      existingOccurrences.some((existingOcc) => isOverlapping(newOcc, existingOcc)),
    );
  }

  const scheduler = $('#scheduler').dxScheduler({
    dataSource: data,
    views: ['day', 'week'],
    currentView: 'week',
    currentDate: new Date(2026, 1, 10),
    startDayHour: 9,
    endDayHour: 19,
    height: 600,
    resources: [{
      fieldExpr: 'projectId',
      dataSource: projects,
      valueExpr: 'id',
      colorExpr: 'color',
    }],
    editing: {
      form: {
        customizeItem(item) {
          if (item.name === 'endDateEditor') {
            const alreadyAdded = (item.validationRules ?? []).some(
              (r) => r.type === 'custom' && r.message === 'This time slot conflicts with another appointment.',
            );
            if (alreadyAdded) return;
            item.validationRules = [
              ...(item.validationRules ?? []),
              {
                type: 'custom',
                message: 'This time slot conflicts with another appointment.',
                validationCallback({ validator }) {
                  if (allowOverlapping) return true;
                  const formEl = validator.$element().closest('.dx-form')[0];
                  const formInstance = DevExpress.ui.dxForm.getInstance(formEl);
                  if (!formInstance) return true;
                  const formData = formInstance.option('formData');
                  const hasConflict = detectConflict(formData);
                  const informerEl = formEl.querySelector('.conflict-informer');
                  if (informerEl) {
                    informerEl.style.display = hasConflict ? '' : 'none';
                  }
                  return !hasConflict;
                },
              },
            ];
          }
        },
      },
    },
    onAppointmentFormOpening(e) {
      const { form } = e;
      const items = form.option('items');
      if (!items.some((item) => item.name === 'conflictInformer')) {
        form.option('items', [
          {
            name: 'conflictInformer',
            itemType: 'simple',
            label: { visible: false },
            template(_, element) {
              const div = document.createElement('div');
              div.className = 'conflict-informer';
              div.textContent = 'This time slot conflicts with another appointment.';
              div.style.display = 'none';
              (element[0] ?? element).appendChild(div);
            },
          },
          ...items,
        ]);
      }
    },
    onAppointmentAdding(e) {
      if (allowOverlapping) return;

      if (detectConflict(e.appointmentData)) {
        e.cancel = true;
        DevExpress.ui.notify(
          'Cannot create an appointment that overlaps with an existing one.',
          'warning',
          2000,
        );
      }
    },
    onAppointmentUpdating(e) {
      if (allowOverlapping) return;

      const updatedAppt = { ...e.appointmentData, ...e.newData };
      if (detectConflict(updatedAppt)) {
        e.cancel = true;
        DevExpress.ui.notify(
          'Cannot move an appointment to a time slot that is already occupied.',
          'warning',
          2000,
        );
      }
    },
  }).dxScheduler('instance');

  $('#allow-overlapping').dxSwitch({
    value: allowOverlapping,
    onValueChanged(e) {
      allowOverlapping = e.value;
    },
  });
});
