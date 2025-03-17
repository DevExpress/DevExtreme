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
              scheduler.showAppointmentPopup({
                startDate: new Date().setUTCHours(17, 0, 0, 0),
                endDate: new Date().setUTCHours(17, 30, 0, 0),
              }, true);
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
              scheduler.option(
                  'dataSource',
                  value.length
                      ? data.filter((item) => value.some((id) => item.assigneeId.includes(id)))
                      : data
              );
            },
          },
        },
        {
          location: 'after',
          locateInMenu: 'auto',
          name: 'viewSwitcher',
        }
      ]
    },
    height: 600,
  }).dxScheduler('instance');
});
