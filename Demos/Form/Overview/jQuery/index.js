$(() => {
  const form = $('#form').dxForm({
    labelMode: 'floating',
    formData: companies[0],
    readOnly: false,
    showColonAfterLabel: true,
    labelLocation: 'left',
    minColWidth: 300,
    colCount: 2,
  }).dxForm('instance');

  const companySelectorSelectBox = $('#select-company').dxSelectBox({
    displayExpr: 'Name',
    dataSource: companies,
    labelMode: 'floating',
    label: 'Select company',
    value: companies[0],
    onValueChanged(data) {
      form.option('formData', data.value);
    },
  }).dxSelectBox('instance');

  const companySelectorText = $('#select-company-text');

  $('#label-mode').dxSelectBox({
    items: ['outside', 'static', 'floating', 'hidden'],
    value: 'floating',
    onValueChanged(data) {
      form.option('labelMode', data.value);

      if (data.value === 'outside') {
        companySelectorSelectBox.option('labelMode', 'hidden');
        companySelectorText.show();
      } else {
        companySelectorSelectBox.option('labelMode', data.value);
        companySelectorText.hide();
      }
    },
  });

  $('#label-location').dxSelectBox({
    items: ['left', 'top'],
    value: 'left',
    onValueChanged(data) {
      form.option('labelLocation', data.value);
    },
  });

  $('#columns-count').dxSelectBox({
    items: ['auto', 1, 2, 3],
    value: 2,
    onValueChanged(data) {
      form.option('colCount', data.value);
    },
  });

  $('#min-column-width').dxSelectBox({
    items: [150, 200, 300],
    value: 300,
    onValueChanged(data) {
      form.option('minColWidth', data.value);
    },
  });

  $('#width').dxNumberBox({
    value: undefined,
    max: 550,
    inputAttr: { 'aria-label': 'Width' },
    onValueChanged(data) {
      form.option('width', data.value);
    },
  });

  $('#read-only').dxCheckBox({
    text: 'readOnly',
    value: false,
    onValueChanged(data) {
      form.option('readOnly', data.value);
    },
  });

  $('#show-colon').dxCheckBox({
    text: 'showColonAfterLabel',
    value: true,
    onValueChanged(data) {
      form.option('showColonAfterLabel', data.value);
    },
  });
});
