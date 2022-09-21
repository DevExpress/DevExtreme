$(() => {
  const zoomLevels = ['month', 'year', 'decade', 'century'];
  const date = new Date().getTime();

  const calendar = $('#calendar-container').dxCalendar({
    value: new Date(),
    disabled: false,
    firstDayOfWeek: 0,
    showWeekNumbers: false,
    zoomLevel: zoomLevels[0],
    onValueChanged(data) {
      selectedDate.option('value', data.value);
    },
    onOptionChanged(data) {
      if (data.name === 'zoomLevel') {
        zoomLevel.option('value', data.value);
      }
    },
  }).dxCalendar('instance');

  $('#min-date').dxCheckBox({
    text: 'Specified min value',
    onValueChanged(data) {
      if (data.value) {
        calendar.option('min', new Date(date - 1000 * 60 * 60 * 24 * 3));
      } else {
        calendar.option('min', null);
      }
    },
  });

  $('#max-date').dxCheckBox({
    text: 'Specified max value',
    onValueChanged(data) {
      if (data.value) {
        calendar.option('max', new Date(date + 1000 * 60 * 60 * 24 * 3));
      } else {
        calendar.option('max', null);
      }
    },
  });

  $('#disable-dates').dxCheckBox({
    text: 'Disable weekend',
    onValueChanged(data) {
      if (data.value) {
        calendar.option('disabledDates', (d) => d.view === 'month' && isWeekend(d.date));
      } else {
        calendar.option('disabledDates', null);
      }
    },
  });

  $('#first-day').dxCheckBox({
    text: 'Monday as the first day of a week',
    onValueChanged(data) {
      if (data.value) {
        calendar.option('firstDayOfWeek', 1);
      } else {
        calendar.option('firstDayOfWeek', 0);
      }
    },
  });

  $('#week-numbers').dxCheckBox({
    text: 'Show week numbers',
    onValueChanged(data) {
      calendar.option('showWeekNumbers', data.value);
    },
  });

  $('#disabled').dxCheckBox({
    text: 'Disabled',
    onValueChanged(data) {
      calendar.option('disabled', data.value);
    },
  });

  $('#custom-cell').dxCheckBox({
    text: 'Use the Custom Cell Template',
    value: false,
    onValueChanged(data) {
      calendar.option('cellTemplate', data.value ? getCellTemplate : 'cell');
    },
  });

  const zoomLevel = $('#zoom-level').dxSelectBox({
    dataSource: zoomLevels,
    value: zoomLevels[0],
    onValueChanged(data) {
      calendar.option('zoomLevel', data.value);
    },
  }).dxSelectBox('instance');

  const selectedDate = $('#selected-date').dxDateBox({
    value: new Date(),
    width: '100%',
    onValueChanged(data) {
      calendar.option('value', data.value);
    },
  }).dxDateBox('instance');

  const holydays = [[1, 0], [4, 6], [25, 11]];

  function isWeekend(d) {
    const day = d.getDay();

    return day === 0 || day === 6;
  }

  function getCellTemplate(data) {
    let cssClass = '';

    if (data.view === 'month') {
      if (!data.date) {
        cssClass = 'week-number';
      } else {
        if (isWeekend(data.date)) { cssClass = 'weekend'; }

        $.each(holydays, (_, item) => {
          if (data.date.getDate() === item[0] && data.date.getMonth() === item[1]) {
            cssClass = 'holyday';
            return false;
          }
          return true;
        });
      }
    }

    return `<span class='${cssClass}'>${data.text}</span>`;
  }
});
