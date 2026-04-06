$(() => {
  const scheduler = $('#scheduler').dxScheduler({
    timeZone: 'America/Los_Angeles',
    dataSource: data,
    views: [{
      type: 'day',
      name: '4 Days',
      intervalCount: 4,
    }, 'week'],
    currentView: 'day',
    currentDate: new Date(2021, 2, 28),
    allDayPanelMode: 'allDay',
    startDayHour: 9,
    height: 600,
  }).dxScheduler('instance');

  $('#modes').dxRadioGroup({
    items: ['all', 'allDay', 'hidden'],
    value: 'allDay',
    layout: 'horizontal',
    onValueChanged: (e) => {
      scheduler.option('allDayPanelMode', e.value);
    },
  });
});
