$(() => {
  const msInDay = 1000 * 60 * 60 * 24;
  const selectionModes = ['single', 'multiple', 'range'];
  const date = new Date().getTime();

  const calendar = $('#calendar').dxCalendar({
    value: [date, date + msInDay],
    showWeekNumbers: true,
    selectWeekOnClick: true,
    selectionMode: 'multiple',
  }).dxCalendar('instance');

  $('#select-week').dxCheckBox({
    text: 'Select week on click',
    value: true,
    onValueChanged(data) {
      calendar.option('selectWeekOnClick', data.value);
    },
  });

  $('#selection-mode').dxSelectBox({
    dataSource: selectionModes,
    value: selectionModes[1],
    inputAttr: { 'aria-label': 'Selection Mode' },
    onValueChanged(data) {
      calendar.option('selectionMode', data.value);
    },
  }).dxSelectBox('instance');

  $('#min-date').dxCheckBox({
    text: 'Set minimum date',
    onValueChanged(data) {
      const minDate = new Date(date - msInDay * 3);

      calendar.option('min', data.value ? minDate : null);
    },
  });

  $('#max-date').dxCheckBox({
    text: 'Set maximum date',
    onValueChanged(data) {
      const maxDate = new Date(date + msInDay * 3);

      calendar.option('max', data.value ? maxDate : null);
    },
  });

  $('#disable-dates').dxCheckBox({
    text: 'Disable weekends',
    onValueChanged(data) {
      if (data.value) {
        calendar.option('disabledDates', (d) => d.view === 'month' && isWeekend(d.date));
      } else {
        calendar.option('disabledDates', null);
      }
    },
  });

  $('#clear-button').dxButton({
    text: 'Clear value',
    onClick: () => { calendar.clear(); },
  });

  function isWeekend(d) {
    const day = d.getDay();

    return day === 0 || day === 6;
  }
});
