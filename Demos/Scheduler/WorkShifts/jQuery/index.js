$(() => {
  const scheduler = $('#scheduler').dxScheduler({
    timeZone: 'America/Los_Angeles',
    dataSource: data,
    views: ['day', 'week'],
    currentView: 'week',
    currentDate: new Date(2021, 2, 30),
    startDayHour: 0,
    endDayHour: 8,
    offset: shifts[0].offset,
    cellDuration: 60,
    showAllDayPanel: false,
  }).dxScheduler('instance');

  $('#shifts').dxRadioGroup({
    items: shifts,
    value: shifts[0],
    layout: 'horizontal',
    onValueChanged: (e) => {
      scheduler.option('offset', e.value.offset);
    },
  });
});
