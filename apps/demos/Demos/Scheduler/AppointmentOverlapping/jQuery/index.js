$(() => {
  let popup;
  let form;
  let shouldShowValidationError = false;

  const scheduler = $('#scheduler').dxScheduler({
    dataSource: data,
    views: ['day', 'week'],
    currentView: 'week',
    currentDate: new Date(2026, 1, 10),
    startDayHour: 9,
    endDayHour: 19,
    height: 600,
    showAllDayPanel: false,
    resources: [{
      fieldExpr: 'assigneeId',
      dataSource: assignees,
      valueExpr: 'id',
      colorExpr: 'color',
      icon: 'user',
      allowMultiple: true,
    }],
    editing: {
      popup: {
        onInitialized: (e) => {
          popup = e.component;
        },
      },
      form: {
        onInitialized: (e) => {
          form = e.component;

          const defaultFieldDataChangedHandler = form.option('onFieldDataChanged');

          form.option('onFieldDataChanged', (e) => {
            defaultFieldDataChangedHandler?.(e);

            if (shouldShowValidationError && (e.dataField === 'startDate' || e.dataField === 'endDate')) {
              shouldShowValidationError = false;
              form.itemOption('mainGroup.conflictInformer', { visible: false });
              form.validate();
            }
          });
        },
        labelMode: 'hidden',
        items: [
          {
            name: 'mainGroup',
            items: [
              {
                name: 'conflictInformer',
                visible: false,
                template: () => $('<div>').dxInformer({
                  text: 'This time slot conflicts with another appointment.',
                }),
              },
              'subjectGroup',
              'dateGroup',
              'repeatGroup',
              {
                name: 'assigneeIdGroup',
                items: [
                  'assigneeIdIcon',
                  {
                    name: 'assigneeId',
                    isRequired: true,
                    editorOptions: {
                      onValueChanged: (e) => {
                        if (e.value.length > 1) {
                          e.component.option('value', [e.value[e.value.length - 1]]);
                        }
                      },
                      tagTemplate: (tagData) => $('<div />')
                        .css('background-color', tagData.color)
                        .css('border-color', tagData.color)
                        .addClass('dx-tag-content')
                        .append(
                          $('<span />').text(tagData.text),
                          $('<div />').addClass('dx-tag-remove-button'),
                        ),
                    },
                  },
                ],
              },
            ],
          },
          'recurrenceGroup',
        ],
        customizeItem: (item) => {
          if (item.name === 'allDayEditor' || item.name === 'recurrenceEndEditor') {
            item.label.visible = true;
          } else if (item.name === 'subjectEditor') {
            item.editorOptions.placeholder = 'Add title';
          }

          if (item.name === 'startTimeEditor' || item.name === 'endTimeEditor') {
            item.validationRules = [
              { type: 'required' },
              {
                type: 'custom',
                message: 'Time conflict',
                ignoreEmptyValue: true,
                reevaluate: false,
                validationCallback: () => !shouldShowValidationError,
              },
            ];
          }
        },
      },
    },
    onAppointmentAdding(e) {
      alertConflictIfNeeded(e, e.appointmentData);
    },
    onAppointmentUpdating(e) {
      alertConflictIfNeeded(e, e.newData);
    },
  }).dxScheduler('instance');

  function alertConflictIfNeeded(e, appointmentData) {
    const hasConflict = detectConflict(appointmentData);

    if (!hasConflict) {
      shouldShowValidationError = false;
      return;
    }

    e.cancel = true;

    if (popup.option('visible')) {
      shouldShowValidationError = true;
      form.itemOption('mainGroup.conflictInformer', { visible: true });
      form.validate();
    } else {
      const dialog = DevExpress.ui.dialog.custom({
        showTitle: false,
        messageHtml: 'This time slot conflicts with another appointment.',
        buttons: [{
          type: 'default',
          text: 'cancel',
          stylingMode: 'contained',
          onClick: () => {
            dialog.hide();
          },
        }],
      });
      dialog.show();
    }
  }

  function isOverlapping(a, b) {
    return a.appointmentData.assigneeId[0] === b.appointmentData.assigneeId[0] &&
      a.startDate < b.endDate && a.endDate > b.startDate;
  }

  function detectConflict(newAppointment) {
    const allAppointments = scheduler.getDataSource().items();
    const startDate = new Date(newAppointment.startDate);
    const endDate = newAppointment.recurrenceRule
      ? scheduler.getEndViewDate()
      : new Date(newAppointment.endDate);

    const existingOccurrences = scheduler
      .getOccurrences(startDate, endDate, allAppointments)
      .filter((occurrence) => occurrence.appointmentData.id !== newAppointment.id);

    const newOccurrences = scheduler.getOccurrences(startDate, endDate, [newAppointment]);

    return newOccurrences.some((newOccurrence) =>
      existingOccurrences.some((existingOccurrence) =>
        isOverlapping(newOccurrence, existingOccurrence),
      ),
    );
  }
});
