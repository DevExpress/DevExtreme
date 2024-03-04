$(() => {
  $('#scheduler').dxScheduler({
    timeZone: 'America/Los_Angeles',
    dataSource: data,
    views: [{
      type: 'month',
      name: 'Auto Mode',
      maxAppointmentsPerCell: 'auto',
    }, {
      type: 'month',
      name: 'Unlimited Mode',
      maxAppointmentsPerCell: 'unlimited',
    }, {
      type: 'month',
      name: 'Numeric Mode',
      maxAppointmentsPerCell: 2,
    }],
    currentView: 'Auto Mode',
    currentDate: new Date(2021, 2, 25),
    resources: [{
      fieldExpr: 'roomId',
      dataSource: resourcesData,
      label: 'Room',
    }],
    height: 730,
  }).dxScheduler('instance');
});
