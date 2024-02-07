$(() => {
  const date = new Date(2018, 9, 16, 15, 8, 12);

  $('#default').dxDateBox({
    placeholder: '12/31/2018, 2:52 PM',
    type: 'datetime',
    showClearButton: true,
    useMaskBehavior: true,
    inputAttr: { 'aria-label': 'Date Time' },
  });

  $('#constant').dxDateBox({
    placeholder: '10/16/2018',
    showClearButton: true,
    useMaskBehavior: true,
    displayFormat: 'shortdate',
    type: 'date',
    value: date,
    inputAttr: { 'aria-label': 'Date' },
  });

  $('#pattern').dxDateBox({
    placeholder: 'Tuesday, 16 of Oct, 2018 14:52',
    showClearButton: true,
    useMaskBehavior: true,
    displayFormat: 'EEEE, d of MMM, yyyy HH:mm',
    value: date,
    inputAttr: { 'aria-label': 'Date' },
  });

  $('#escape').dxDateBox({
    placeholder: 'Year: 2018',
    showClearButton: true,
    useMaskBehavior: true,
    displayFormat: "'Year': yyyy",
    type: 'date',
    value: date,
    inputAttr: { 'aria-label': 'Date' },
  });
});
