$(() => {
  const scheduler = $('#scheduler').dxScheduler({
    timeZone: 'America/Los_Angeles',
    dataSource: data,
    views: ['workWeek'],
    currentView: 'workWeek',
    currentDate: new Date(2021, 3, 27),
    startDayHour: 9,
    endDayHour: 19,
    resources: [
      {
        fieldExpr: 'roomId',
        dataSource: rooms,
        label: 'Room',
        icon: 'conferenceroomoutline',
      }, {
        fieldExpr: 'priorityId',
        dataSource: priorities,
        label: 'Priority',
        icon: 'tags',
      }, {
        fieldExpr: 'assigneeId',
        allowMultiple: true,
        dataSource: assignees,
        label: 'Assignee',
        icon: 'user',
      }],
    height: 600,
  }).dxScheduler('instance');

  $('#resources-selector').dxRadioGroup({
    items: resourcesList,
    value: resourcesList[0],
    layout: 'horizontal',
    onValueChanged(e) {
      const resources = scheduler.option('resources');

      scheduler.option('resources', resources.map((resource) => ({
        ...resource,
        useColorAsDefault: resource.label === e.value,
      })));
    },
  });
});
