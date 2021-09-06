window.onload = function () {
  const showCurrentTimeIndicatorValue = ko.observable(true);
  const shadeUntilCurrentTimeValue = ko.observable(true);
  const updateIntervalOptionsValue = ko.observable(10);
  const updateIntervalInMs = ko.computed(() => updateIntervalOptionsValue() * 1000);

  const viewModel = {
    schedulerOptions: {
      dataSource: data,
      views: ['week', 'timelineWeek'],
      currentView: 'week',
      showCurrentTimeIndicator: showCurrentTimeIndicatorValue,
      showAllDayPanel: false,
      shadeUntilCurrentTime: shadeUntilCurrentTimeValue,
      indicatorUpdateInterval: updateIntervalInMs,
      currentDate: new Date(),
      editing: false,
      height: 600,
      resources: [{
        fieldExpr: 'movieId',
        dataSource: moviesData,
      }],
      appointmentTemplate: 'appointment-template',
      onContentReady(e) {
        e.component.scrollTo(new Date());
      },
      onAppointmentClick(e) {
        e.cancel = true;
      },
      onAppointmentDblClick(e) {
        e.cancel = true;
      },
    },
    showIndicatorOptions: {
      value: showCurrentTimeIndicatorValue,
    },
    allowShadingOptions: {
      value: shadeUntilCurrentTimeValue,
    },
    updateIntervalOptions: {
      min: 1,
      max: 1200,
      value: updateIntervalOptionsValue,
      step: 10,
      showSpinButtons: true,
      width: '100px',
      format: '#0 s',
    },
    getMovieById,
  };

  ko.applyBindings(viewModel, document.getElementById('scheduler-demo'));

  function getMovieById(id) {
    return DevExpress.data.query(moviesData)
      .filter('id', id)
      .toArray()[0];
  }
};
