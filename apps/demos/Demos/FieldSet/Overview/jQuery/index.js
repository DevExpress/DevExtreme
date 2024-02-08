$(() => {
  $('#address').dxTextBox({
    value: '424 N Main St.',
    inputAttr: { 'aria-label': 'Address' },
  });

  $('#city').dxTextBox({
    value: 'San Diego',
    inputAttr: { 'aria-label': 'City' },
  });

  $('#notes').dxTextArea({
    value: 'Kevin is our hard-working shipping manager and has been helping that department work like clockwork for 18 months. When not in the office, he is usually on the basketball court playing pick-up games.',
    height: 80,
    inputAttr: { 'aria-label': 'Notes' },
  });
});
