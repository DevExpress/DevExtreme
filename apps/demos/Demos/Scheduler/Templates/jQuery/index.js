$(() => {
  let form;
  let $movieInfoContainer;

  $('#scheduler').dxScheduler({
    timeZone: 'America/Los_Angeles',
    dataSource: data,
    views: ['day', 'week', 'timelineDay'],
    currentView: 'day',
    currentDate: new Date(2021, 3, 27),
    firstDayOfWeek: 0,
    startDayHour: 9,
    endDayHour: 23,
    showAllDayPanel: false,
    height: 600,
    groups: ['theatreId'],
    crossScrollingEnabled: true,
    cellDuration: 20,
    resources: [{
      fieldExpr: 'movieId',
      dataSource: moviesData,
      useColorAsDefault: true,
    }, {
      fieldExpr: 'theatreId',
      dataSource: theatreData,
    }],
    appointmentTemplate,
    appointmentTooltipTemplate: (model) => {
      const movie = getMovieById(model.targetedAppointmentData.movieId);
      return movieInfoTemplate(movie);
    },
    onAppointmentFormOpening(e) {
      form = e.form;

      form.on('fieldDataChanged', (e) => {
        if (e.dataField === 'startDate') {
          const movie = getMovieById(form.option('formData').movieId);
          updateEndDate(form, movie);
        }
      });
    },
    editing: {
      allowAdding: false,
      form: {
        items: [
          {
            template: () => {
              $movieInfoContainer = $('<div class="movie-info-container">');
              updateMovieInfoContainer({});
              return $movieInfoContainer;
            },
          },
          {
            itemType: 'group',
            colCount: 2,
            colCountByScreen: { xs: 2 },
            items: [
              {
                label: { text: 'Movie' },
                colSpan: 1,
                editorType: 'dxSelectBox',
                dataField: 'movieId',
                editorOptions: {
                  items: moviesData,
                  displayExpr: 'text',
                  valueExpr: 'id',
                  stylingMode: getEditorStylingMode(),
                  onValueChanged(e) {
                    const movie = getMovieById(e.value);

                    updateMovieInfoContainer(movie);

                    if (!form) {
                      return;
                    }

                    form.updateData('director', movie.director);
                    updateEndDate(form, movie);
                  },
                  onContentReady: (e) => {
                    e.component.option('stylingMode', getEditorStylingMode());
                  },
                },
              },
              {
                label: { text: 'Price' },
                colSpan: 1,
                editorType: 'dxSelectBox',
                dataField: 'price',
                editorOptions: {
                  items: [5, 10, 15, 20],
                  displayExpr: (value) => `$${value}`,
                  stylingMode: getEditorStylingMode(),
                  onContentReady: (e) => {
                    e.component.option('stylingMode', getEditorStylingMode());
                  },
                },
              },
            ],
          },
          'startDateGroup',
          {
            name: 'endDateGroup',
            disabled: true,
          },
        ],
      },
    },
  }).dxScheduler('instance');

  function getMovieById(id) {
    return DevExpress.data.query(moviesData)
      .filter('id', id)
      .toArray()[0];
  }

  function updateEndDate(form, movie) {
    const { startDate } = form.option('formData');
    const newEndDate = new Date(startDate.getTime() + 60 * 1000 * movie.duration);

    form.updateData('endDate', newEndDate);
  }

  function appointmentTemplate(model) {
    const { movieId, displayStartDate, displayEndDate, price } = model.targetedAppointmentData;
    const movie = getMovieById(movieId) || {};

    return $(`
      <div class='movie-preview'>
        <div class='movie-preview-image'>
          <img src='${movie.image}' />
        </div>
        <div class='movie-details'>
          <div class='title'>${movie.text}</div>
          <div>Ticket Price: <b>$${price}</b></div>
          <div>
            ${DevExpress.localization.formatDate(displayStartDate, 'shortTime')}
            - ${DevExpress.localization.formatDate(displayEndDate, 'shortTime')}
          </div>
        </div>
      </div>
    `);
  }

  function movieInfoTemplate(movie) {
    return $(`
      <div class='movie-info'>
        <div class='movie-preview-image'>
          <img src='${movie.image}' />
        </div>
        <div class='movie-details'>
          <div class='title'>${movie.text} (${movie.year})</div>
          <div>Director: ${movie.director}</div>
          <div>Duration: ${movie.duration} minutes</div>
        </div>
      </div>
    `);
  }

  function updateMovieInfoContainer(movie) {
    const $movieInfo = movieInfoTemplate(movie);
    $movieInfoContainer.empty().append($movieInfo);
  }

  function getEditorStylingMode() {
    return $('.dx-theme-fluent, .dx-theme-material').length > 0 ? 'filled' : 'outlined';
  }
});
