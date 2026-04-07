$(() => {
  const scheduler = $('#scheduler').dxScheduler({
    timeZone: 'America/Los_Angeles',
    dataSource: data,
    views: ['timelineDay', 'timelineWeek', 'timelineWorkWeek', 'timelineMonth'],
    currentView: 'timelineMonth',
    currentDate: new Date(2021, 1, 2),
    firstDayOfWeek: 0,
    startDayHour: 8,
    endDayHour: 20,
    cellDuration: 60,
    snapToCellsMode: 'always',
    groups: ['priority'],
    resources: [{
      fieldExpr: 'ownerId',
      allowMultiple: true,
      dataSource: resourcesData,
      label: 'Owner',
      useColorAsDefault: true,
      icon: 'user',
    }, {
      fieldExpr: 'priority',
      allowMultiple: false,
      dataSource: priorityData,
      label: 'Priority',
      icon: 'tags',
    }],
    height: 580,
  }).dxScheduler('instance');

  $('#snap-to-cells-mode').dxSelectBox({
    items: ['auto', 'always', 'never'],
    value: scheduler.option('snapToCellsMode'),
    onValueChanged(e) {
      scheduler.option('snapToCellsMode', e.value);
    },
  });
});
