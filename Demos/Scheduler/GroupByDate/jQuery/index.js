$(() => {
  const groupByDate = $('#groupByDate').dxSwitch({
    value: true,
    onValueChanged(args) {
      scheduler.option('groupByDate', args.value);
    },
  }).dxSwitch('instance');

  const scheduler = $('#scheduler').dxScheduler({
    timeZone: 'America/Los_Angeles',
    dataSource: data,
    views: [{
      type: 'week',
      name: 'Week',
    }, {
      type: 'month',
      name: 'Month',
    }],
    currentView: 'Week',
    crossScrollingEnabled: true,
    groupByDate: groupByDate.option('value'),
    currentDate: new Date(2021, 3, 21),
    startDayHour: 9,
    endDayHour: 16,
    groups: ['priorityId'],
    resources: [
      {
        fieldExpr: 'priorityId',
        allowMultiple: false,
        dataSource: priorityData,
        label: 'Priority',
      },
    ],
    height: 730,
  }).dxScheduler('instance');
});
