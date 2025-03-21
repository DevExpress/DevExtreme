$(() => {
  const scheduler = $('#scheduler').dxScheduler({
    timeZone: 'America/Los_Angeles',
    dataSource: data,
    views: ['day', 'week', 'workWeek', 'month'],
    currentView: 'workWeek',
    currentDate: new Date(2021, 3, 27),
    startDayHour: 9,
    endDayHour: 19,
    resources: [{
      fieldExpr: 'assigneeId',
      allowMultiple: true,
      dataSource: assignees,
      label: 'Assignee',
    }],
    toolbar: {
      items: [
        {
          location: 'before',
          locateInMenu: 'auto',
          widget: 'dxButton',
          options: {
            text: 'Today',
            onClick() {
              scheduler.option('currentDate', new Date());
            },
          },
        },
        'dateNavigator',
        {
          location: 'before',
          locateInMenu: 'auto',
          widget: 'dxButton',
          options: {
            icon: 'plus',
            text: 'New Event',
            onClick() {
              const selected = scheduler.option('selectedCellData');

              if (selected.length) {
                scheduler.showAppointmentPopup({
                  ...selected[0].groups,
                  allDay: selected[0].allDay,
                  startDate: new Date(selected[0].startDateUTC),
                  endDate: new Date(selected.at(-1).endDateUTC),
                }, true);
              } else {
                const cellDuration = scheduler.option('cellDuration') * 60 * 1000; // ms
                const currentTime = new Date().getTime();
                const roundTime = Math.round(currentTime / cellDuration) * cellDuration;

                scheduler.showAppointmentPopup({
                  startDate: new Date(roundTime),
                  endDate: new Date(roundTime + cellDuration),
                }, true);
              }
            },
          },
        },
        {
          location: 'center',
          locateInMenu: 'auto',
          widget: 'dxTagBox',
          options: {
            items: assignees,
            displayExpr: 'text',
            valueExpr: 'id',
            searchEnabled: true,
            showSelectionControls: true,
            maxDisplayedTags: 1,
            inputAttr: {
              'aria-label': 'Assignees',
            },
            width: 200,
            onValueChanged({ value }) {
              const nextDataSource = value.length
                ? data.filter((item) => value.some((id) => item.assigneeId?.includes(id)))
                : data;

              scheduler.option('dataSource', nextDataSource);
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
