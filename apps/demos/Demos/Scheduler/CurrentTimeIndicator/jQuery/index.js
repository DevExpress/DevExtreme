$(() => {
  const scheduler = $('#scheduler').dxScheduler({
    dataSource: data,
    views: ['week', 'timelineWeek'],
    currentView: 'week',
    showCurrentTimeIndicator: true,
    indicatorUpdateInterval: 10000,
    showAllDayPanel: false,
    shadeUntilCurrentTime: true,
    currentDate: new Date(),
    editing: false,
    height: 600,
    resources: [{
      fieldExpr: 'movieId',
      dataSource: moviesData,
    }],
    appointmentTemplate(model) {
      const movieInfo = getMovieById(model.appointmentData.movieId) || {};

      return $(`${"<div class='movie'>"
                + "<img src='"}${movieInfo.image}' alt='${movieInfo.text} poster' />`
                + `<div class='movie-text'>${movieInfo.text}</div>`
                + '</div>');
    },
    onContentReady(e) {
      e.component.scrollTo(new Date());
    },
    onAppointmentClick(e) {
      e.cancel = true;
    },
    onAppointmentDblClick(e) {
      e.cancel = true;
    },
  }).dxScheduler('instance');

  $('#show-indicator').dxSwitch({
    value: true,
    onValueChanged(e) {
      scheduler.option('showCurrentTimeIndicator', e.value);
    },
  });

  $('#allow-shading').dxSwitch({
    value: true,
    onValueChanged(e) {
      scheduler.option('shadeUntilCurrentTime', e.value);
    },
  });

  $('#update-interval').dxNumberBox({
    min: 1,
    max: 1200,
    value: 10,
    step: 10,
    showSpinButtons: true,
    width: '100px',
    format: '#0 s',
    inputAttr: { 'aria-label': 'Interval' },
    onValueChanged(e) {
      scheduler.option('indicatorUpdateInterval', e.value * 1000);
    },
  });

  function getMovieById(id) {
    return DevExpress.data.query(moviesData)
      .filter('id', id)
      .toArray()[0];
  }
});
