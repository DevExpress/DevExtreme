window.onload = function () {
  const dataSource = new DevExpress.data.DataSource({
    store: data,
    filter: ['startDateTimeZone', locations[0].value],
  });

  const currentLocation = ko.observable(locations[0].value);

  const timeZone = ko.computed(() => {
    const result = currentLocation();
    dataSource.filter(['startDateTimeZone', result]);
    return result;
  });

  const viewModel = {
    schedulerOptions: {
      dataSource,
      views: ['workWeek'],
      currentView: 'workWeek',
      currentDate: new Date(2021, 3, 27),
      height: 600,
      timeZone,
      resources: [
        {
          fieldExpr: 'startDateTimeZone',
          valueExpr: 'value',
          dataSource: locations,
        },
      ],
      onAppointmentFormOpening(e) {
        e.form.itemOption('startDateTimeZone', { visible: true });
        e.form.itemOption('endDateTimeZone', { visible: true });
      },
    },
    locationSwitcherOptions: {
      items: locations,
      width: 200,
      value: currentLocation,
      displayExpr: 'text',
      valueExpr: 'value',
    },
  };

  ko.applyBindings(viewModel, document.getElementById('scheduler-demo'));
};
