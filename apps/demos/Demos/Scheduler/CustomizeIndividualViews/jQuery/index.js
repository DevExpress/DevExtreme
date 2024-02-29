$(() => {
  const dayOfWeekNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const dateCellTemplate = function (cellData, index, container) {
    container.append(
      $('<div />')
        .addClass('name')
        .text(dayOfWeekNames[cellData.date.getDay()]),
      $('<div />')
        .addClass('number')
        .text(cellData.date.getDate()),
    );
  };

  $('#scheduler').dxScheduler({
    timeZone: 'America/Los_Angeles',
    height: 730,
    dataSource: data,
    showAllDayPanel: false,
    views: ['day',
      {
        type: 'week',
        groups: ['typeId'],
        dateCellTemplate,
      }, {
        type: 'workWeek',
        startDayHour: 9,
        endDayHour: 18,
        groups: ['priorityId'],
        dateCellTemplate,
      },
      'month'],
    currentView: 'workWeek',
    currentDate: new Date(2021, 3, 27),
    startDayHour: 7,
    endDayHour: 23,
    resources: [{
      fieldExpr: 'priorityId',
      allowMultiple: false,
      dataSource: priorityData,
      label: 'Priority',
    }, {
      fieldExpr: 'typeId',
      allowMultiple: false,
      dataSource: typeData,
      label: 'Type',
    }],
  });
});
