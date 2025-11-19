$(() => {
  const MS_IN_HOUR = 60 * 1000;

  const scheduler = $('#scheduler').dxScheduler({
    timeZone: 'America/Los_Angeles',
    dataSource: schedulerDataSource,
    views: ['day', 'week', 'workWeek', 'month'],
    currentView: 'workWeek',
    currentDate,
    startDayHour: 9,
    endDayHour: 19,
    resources: [{
      fieldExpr: 'assigneeId',
      allowMultiple: true,
      dataSource: assignees,
      label: 'Assignee',
      icon: 'user',
    }],
    toolbar: {
      items: [
        'today',
        'dateNavigator',
        {
          location: 'before',
          locateInMenu: 'auto',
          widget: 'dxButton',
          options: {
            icon: 'plus',
            text: 'New Appointment',
            stylingMode: 'outlined',
            type: 'normal',
            onClick() {
              const selected = scheduler.option('selectedCellData');

              if (selected.length) {
                const firstSelected = selected[0];
                const lastSelected = selected.at(-1);

                scheduler.showAppointmentPopup({
                  ...firstSelected.groups,
                  allDay: firstSelected.allDay,
                  startDate: new Date(firstSelected.startDateUTC),
                  endDate: new Date(lastSelected.endDateUTC),
                }, true);

                return;
              }

              const currentDate = scheduler.option('currentDate');
              const cellDuration = scheduler.option('cellDuration') * MS_IN_HOUR;
              const currentTime = currentDate.getTime();
              const roundTime = Math.round(currentTime / cellDuration) * cellDuration;

              scheduler.showAppointmentPopup({
                startDate: new Date(roundTime),
                endDate: new Date(roundTime + cellDuration),
              }, true);
            },
          },
        },
        {
          location: 'before',
          locateInMenu: 'auto',
          widget: 'dxSelectBox',
          options: {
            placeholder: 'Select Employee',
            items: assignees,
            showClearButton: true,
            displayExpr: 'text',
            valueExpr: 'id',
            inputAttr: {
              'aria-label': 'Select Employee',
            },
            width: 200,
            onValueChanged({ value }) {
              const dataSource = scheduler.option('dataSource');
              const filter = value ? ['assigneeId', 'contains', value] : null;

              dataSource.filter(filter);
              scheduler.option('dataSource', dataSource);
            },
          },
        },
        {
          location: 'after',
          locateInMenu: 'auto',
          name: 'viewSwitcher',
        },
      ],
    },
    height: 600,
  }).dxScheduler('instance');
});
