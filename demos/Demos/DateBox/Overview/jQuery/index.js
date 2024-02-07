$(() => {
  const now = new Date();

  $('#date').dxDateBox({
    type: 'date',
    value: now,
    inputAttr: { 'aria-label': 'Date' },
  });

  $('#time').dxDateBox({
    type: 'time',
    value: now,
    inputAttr: { 'aria-label': 'Time' },
  });

  $('#date-time').dxDateBox({
    type: 'datetime',
    value: now,
    inputAttr: { 'aria-label': 'Date Time' },
  });

  $('#custom').dxDateBox({
    displayFormat: 'EEEE, MMM dd',
    value: now,
    inputAttr: { 'aria-label': 'Custom Date' },
  });

  $('#date-by-picker').dxDateBox({
    pickerType: 'rollers',
    value: now,
    inputAttr: { 'aria-label': 'Picker Date' },
  });

  $('#disabled').dxDateBox({
    type: 'datetime',
    disabled: true,
    value: now,
    inputAttr: { 'aria-label': 'Disabled' },
  });

  $('#disabledDates').dxDateBox({
    type: 'date',
    pickerType: 'calendar',
    value: new Date(2017, 0, 3),
    disabledDates: federalHolidays,
    inputAttr: { 'aria-label': 'Disabled' },
  });

  $('#clear').dxDateBox({
    type: 'time',
    showClearButton: true,
    value: new Date(2015, 11, 1, 6),
    inputAttr: { 'aria-label': 'Clear Date' },
  });

  const startDate = new Date(1981, 3, 27);

  $('#birthday').dxDateBox({
    applyValueMode: 'useButtons',
    value: startDate,
    max: new Date(),
    min: new Date(1900, 0, 1),
    inputAttr: { 'aria-label': 'Birth Date' },
    onValueChanged(data) {
      dateDiff(new Date(data.value));
    },
  });

  function dateDiff(date) {
    const diffInDay = Math.floor(Math.abs((new Date() - date) / (24 * 60 * 60 * 1000)));
    return $('#age').text(`${diffInDay} days`);
  }

  dateDiff(startDate);
});
