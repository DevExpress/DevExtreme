$(() => {
  const startDay = new Date(2021, 1, 1);
  const endDay = new Date(2021, 1, 28);

  const startDayHour = 8;
  const endDayHour = 20;

  const appointments = generateAppointments(startDay, endDay, startDayHour, endDayHour);

  $('#scheduler').dxScheduler({
    height: 730,
    currentDate: new Date(2021, 1, 2),
    dataSource: appointments,
    views: [
      {
        type: 'timelineWorkWeek',
        name: 'Timeline',
        groupOrientation: 'vertical',
      },
      {
        type: 'workWeek',
        groupOrientation: 'vertical',
      },
      {
        type: 'month',
        groupOrientation: 'horizontal',
      },
    ],
    currentView: 'Timeline',
    startDayHour,
    endDayHour,
    cellDuration: 60,
    scrolling: {
      mode: 'virtual',
    },
    showAllDayPanel: false,
    groups: ['humanId'],
    resources: [{
      fieldExpr: 'humanId',
      dataSource: resources,
      label: 'Employee',
    }],
  });
});
