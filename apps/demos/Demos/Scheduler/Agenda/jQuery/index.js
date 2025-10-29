$(() => {
  $('#scheduler').dxScheduler({
    timeZone: 'America/Los_Angeles',
    dataSource: new DevExpress.data.ArrayStore({
      key: 'id',
      data,
    }),
    views: ['agenda'],
    currentView: 'agenda',
    currentDate: new Date(2021, 4, 11),
    startDayHour: 9,
    resources: [
      {
        fieldExpr: 'assigneeId',
        allowMultiple: true,
        dataSource: assignees,
        label: 'Assignee',
        useColorAsDefault: true,
        icon: 'user',
      }, {
        fieldExpr: 'priorityId',
        dataSource: priorities,
        label: 'Priority',
        icon: 'tags',
      }],
    height: 600,
  });
});
