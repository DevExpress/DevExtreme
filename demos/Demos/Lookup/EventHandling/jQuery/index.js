$(() => {
  const lookup = $('#lookup').dxLookup({
    items: employees,
    displayExpr(item) {
      if (!item) {
        return '';
      }

      return `${item.FirstName} ${item.LastName}`;
    },
    applyValueMode: 'instantly',
    dropDownOptions: {
      showTitle: false,
    },
    placeholder: 'Select employee',
    inputAttr: {
      'aria-label': 'Lookup',
    },
    onValueChanged(e) {
      $('.selected').show();
      $('#selected-employee-img').attr('src', e.value.Picture);
      $('#selected-employee-notes').text(e.value.Notes);
    },
  }).dxLookup('instance');

  $('#applyValueMode').dxSelectBox({
    items: ['instantly', 'useButtons'],
    inputAttr: { 'aria-label': 'Apply Value Mode' },
    value: 'instantly',
    onValueChanged(e) {
      lookup.option('applyValueMode', e.value);
    },
  });
});
