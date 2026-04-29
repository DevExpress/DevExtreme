$(() => {
  let popup;
  let form;
  let showConflictError = false;
  let overlappingRule = 'sameResource';

  const scheduler = $('#scheduler').dxScheduler({
    dataSource: data,
    views: ['day', 'week', 'workWeek', 'month'],
    currentView: 'week',
    currentDate: new Date(2026, 1, 10),
    startDayHour: 9,
    endDayHour: 19,
    height: 600,
    showAllDayPanel: false,
    allDayPanelMode: 'hidden',
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
        onHidden: () => {
          setConflictError(false);
        },
      },
      form: {
        labelMode: 'hidden',
        elementAttr: { class: 'hide-informer', id: 'form' },
        onInitialized: (e) => {
          form = e.component;

          form.on('fieldDataChanged', (e) => {
            if (showConflictError && ['startDate', 'endDate', 'assigneeId', 'recurrenceRule'].includes(e.dataField)) {
              setConflictError(false);
              form.validate();
            }
          });
        },
        items: [
          {
            name: 'conflictInformer',
            template: () => $('<div>')
              .addClass('conflict-informer')
              .text('This time slot conflicts with another appointment.'),
          },
          {
            name: 'mainGroup',
            items: [
              'subjectGroup',
              'dateGroup',
              'repeatGroup',
              {
                name: 'assigneeIdGroup',
                items: [
                  'assigneeIdIcon',
                  {
                    name: 'assigneeIdEditor',
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
                reevaluate: true,
                validationCallback: () => !showConflictError,
              },
            ];
          }
        },
      },
    },
    onAppointmentAdding(e) {
      handleConflict(e, e.appointmentData);
    },
    onAppointmentUpdating(e) {
      handleConflict(e, e.newData);
    },
  }).dxScheduler('instance');

  function setConflictError(show) {
    showConflictError = show;
    form?.option('elementAttr.class', show ? '' : 'hide-informer');
  }

  function handleConflict(e, appointmentData) {
    if (!detectConflict(appointmentData)) {
      setConflictError(false);
      return;
    }

    e.cancel = true;

    if (popup?.option('visible')) {
      setConflictError(true);
      form.validate();
    } else {
      const dialog = DevExpress.ui.dialog.custom({
        showTitle: false,
        messageHtml: '<p id="conflict-dialog">This time slot conflicts with another appointment.</p>',
        buttons: [{
          type: 'default',
          text: 'Close',
          stylingMode: 'contained',
          onClick: () => {
            dialog.hide();
          },
        }],
      });
      dialog.show();
    }
  }

  function getNextDay(date) {
    const next = new Date(date);
    next.setDate(next.getDate() + 1);
    return next;
  }

  function getEndDate(occurrence) {
    return occurrence.appointmentData.allDay
      ? getNextDay(occurrence.startDate)
      : occurrence.endDate;
  }

  function isOverlapping(a, b) {
    const aEnd = getEndDate(a);
    const bEnd = getEndDate(b);
    if (a.startDate >= bEnd || b.startDate >= aEnd) return false;
    if (overlappingRule === 'sameResource') {
      return a.appointmentData.assigneeId[0] === b.appointmentData.assigneeId[0];
    }
    return true;
  }

  function detectConflict(newAppointment) {
    const allAppointments = scheduler.getDataSource().items();
    const startDate = new Date(newAppointment.startDate);
    let endDate;
    if (newAppointment.recurrenceRule) {
      endDate = scheduler.getEndViewDate();
    } else if (newAppointment.allDay) {
      endDate = getNextDay(startDate);
    } else {
      endDate = new Date(newAppointment.endDate);
    }

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

  $('#overlapping-rule').dxSelectBox({
    items: [
      { value: 'sameResource', text: 'Different Resources' },
      { value: 'allResources', text: 'Never' },
    ],
    valueExpr: 'value',
    displayExpr: 'text',
    value: 'sameResource',
    onValueChanged(e) {
      overlappingRule = e.value;
    },
  });
});
